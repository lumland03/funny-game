const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// --- DECK & SCORING LOGIC ---

function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let newDeck = [];

    for (let suit of suits) {
        for (let value of values) {
            newDeck.push({ suit, value });
        }
    }
    return newDeck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    hand.forEach(card => {
        if (card.value === 'A') {
            aces += 1;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    });

    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }
    return score;
}

// Initialize the master deck
let gameDeck = shuffle(createDeck());

// --- COMMUNICATION LOGIC ---

io.on('connection', (socket) => {
    console.log('A player joined:', socket.id);

    // Keep track of this specific player's hands
    let playerHand = [];
    let dealerHand = [];

    // 1. START GAME: Resets and deals initial 4 cards
    socket.on('startGame', () => {
        // Reshuffle if deck is low
        if (gameDeck.length < 20) gameDeck = shuffle(createDeck());

        playerHand = [gameDeck.pop(), gameDeck.pop()];
        dealerHand = [gameDeck.pop(), gameDeck.pop()];

        socket.emit('gameState', {
            playerHand: playerHand,
            playerScore: calculateScore(playerHand),
            dealerUpCard: dealerHand[0], 
            cardsRemaining: gameDeck.length
        });
    });

    // 2. HIT: Deals one card to the player
    socket.on('requestCard', () => {
        console.log("SERVER: Hit button was pressed!");
        if (gameDeck.length < 2) gameDeck = shuffle(createDeck());

        const card = gameDeck.pop();
        playerHand.push(card);
        
        const total = calculateScore(playerHand);

        socket.emit('receiveCard', {
            card: card,
            score: total,
            isBust: total > 21
        });
    });

    socket.on('stay', () => {
        console.log("SERVER: Stay button was pressed!");
        let dealerScore = calculateScore(dealerHand);

        // Dealer must hit until they reach 17
        while (dealerScore < 17) {
            dealerHand.push(gameDeck.pop());
            dealerScore = calculateScore(dealerHand);
        }

        const playerScore = calculateScore(playerHand);
        let result = '';

        // Determine Winner
        if (dealerScore > 21) {
            result = 'Dealer Busted! YOU WIN!';
        } else if (dealerScore > playerScore) {
            result = 'Dealer Wins!';
        } else if (dealerScore < playerScore) {
            result = 'YOU WIN!';
        } else {
            result = 'Push (Tie)!';
        }

        // Send everything back to the client
        socket.emit('dealerTurn', {
            fullDealerHand: dealerHand,
            dealerScore: dealerScore,
            result: result
        });
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});