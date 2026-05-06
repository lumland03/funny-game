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

// --- COMMUNICATION LOGIC ---

io.on('connection', (socket) => {
    console.log('A player joined:', socket.id);

    // FIX: Scoped per player so games don't mix up
    let gameDeck = shuffle(createDeck());
    let playerHand = [];
    let dealerHand = [];
    let gameInProgress = false;

    socket.on('startGame', () => {
        // Guard: Refresh deck if low
        if (gameDeck.length < 10) gameDeck = shuffle(createDeck());

        playerHand = [gameDeck.pop(), gameDeck.pop()];
        dealerHand = [gameDeck.pop(), gameDeck.pop()];
        gameInProgress = true;

        const playerScore = calculateScore(playerHand);
        const isBlackjack = playerScore === 21;
        
        let finalDealerHand = null;
        let finalDealerScore = null;

        // FIX: Immediate dealer resolution for Blackjack
        if (isBlackjack) {
            gameInProgress = false; // Game ends immediately
            let dScore = calculateScore(dealerHand);
            while (dScore < 17) {
                // Guard: Deck check inside loop
                if (gameDeck.length < 1) gameDeck = shuffle(createDeck());
                dealerHand.push(gameDeck.pop());
                dScore = calculateScore(dealerHand);
            }
            finalDealerHand = dealerHand;
            finalDealerScore = dScore;
        }

        socket.emit('gameState', {
            playerHand: playerHand,
            playerScore: playerScore,
            dealerUpCard: dealerHand[0],
            isBlackjack: isBlackjack,
            fullDealerHand: finalDealerHand,
            dealerScore: finalDealerScore
        });
    });

    socket.on('requestCard', () => {
        if (!gameInProgress) return;
        if (calculateScore(playerHand) >= 21) return;

        if (gameDeck.length < 2) gameDeck = shuffle(createDeck());
        const card = gameDeck.pop();
        playerHand.push(card);
        
        const total = calculateScore(playerHand);
        if (total >= 21) gameInProgress = false; // Auto-stop if 21 or bust

        socket.emit('receiveCard', {
            card: card,
            score: total,
            isBust: total > 21
        });
    });

    socket.on('stay', () => {
        if (!gameInProgress) return;
        gameInProgress = false;

        let dScore = calculateScore(dealerHand);
        while (dScore < 17) {
            if (gameDeck.length < 1) gameDeck = shuffle(createDeck());
            dealerHand.push(gameDeck.pop());
            dScore = calculateScore(dealerHand);
        }

        const pScore = calculateScore(playerHand);
        let result = '';
        if (dScore > 21) result = 'Dealer Busted! YOU WIN!';
        else if (dScore > pScore) result = 'Dealer Wins!';
        else if (dScore < pScore) result = 'YOU WIN!';
        else result = 'Push (Tie)!';

        socket.emit('dealerTurn', {
            fullDealerHand: dealerHand,
            dealerScore: dScore,
            result: result
        });
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});