const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const rooms = {}; 

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

// ==========================================
// NEW ROUTING MATRIX
// ==========================================
io.on('connection', (socket) => {
    console.log('A player joined the server:', socket.id);

    socket.on('modeSelection', (mode) => {
        if (mode === 'single') {
            setupSinglePlayerLogic(socket);
        } else if (mode === 'multi') {
            setupMultiplayerLogic(socket);
        }
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
});

// ==========================================
// SINGLE PLAYER WRAPPER (Your Working Logic)
// ==========================================
function setupSinglePlayerLogic(socket) {
    console.log(`[Mode] Socket ${socket.id} is playing Solo.`);

    let gameDeck = shuffle(createDeck());
    let playerHand = [];
    let dealerHand = [];
    let gameInProgress = false;

    // --- START GAME HANDLER ---
    socket.on('startGame', () => {
        if (gameDeck.length < 20) gameDeck = shuffle(createDeck());

        playerHand = [gameDeck.pop(), gameDeck.pop()];
        dealerHand = [gameDeck.pop(), gameDeck.pop()];
        gameInProgress = true;

        const playerScore = calculateScore(playerHand);
        const isBlackjack = playerScore === 21;
        
        let finalDealerHand = null;
        let finalDealerScore = null;

        if (isBlackjack) {
            gameInProgress = false; 
            let dScore = calculateScore(dealerHand);
            while (dScore < 17) {
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

    // --- REQUEST CARD (HIT) HANDLER ---
    socket.on('requestCard', () => {
        if (!gameInProgress) return;
        if (calculateScore(playerHand) >= 21) return;

        if (gameDeck.length < 2) gameDeck = shuffle(createDeck());
        const card = gameDeck.pop();
        playerHand.push(card);
        
        const total = calculateScore(playerHand);
        if (total > 21) gameInProgress = false; 

        socket.emit('receiveCard', {
            card: card,
            score: total,
            isBust: total > 21
        });
    });

    // --- STAY HANDLER ---
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
}

// ==========================================
// MULTIPLAYER MANAGER (Our New Workspace)
// ==========================================
function setupMultiplayerLogic(socket) {
    console.log(`[Mode] Socket ${socket.id} entered the Multiplayer Pool.`);
    
    // Track what room this specific socket eventually joins
    let currentRoomName = null;

    socket.on('joinRoom', (roomName) => {
        // Clean up the string just in case
        const room = roomName.trim();
        if (!room) return;

        currentRoomName = room;
        socket.join(room); // Socket.io built-in room clustering

        // 1. If the room doesn't exist yet, initialize it
        if (!rooms[room]) {
            rooms[room] = {
                deck: shuffle(createDeck()),
                players: [],       // Array to hold player objects
                dealerHand: [],
                status: 'waiting', // 'waiting', 'playing', 'resolved'
                currentTurn: 0     // Index tracking whose turn it is
            };
            console.log(`[Multiplayer] Room Created: ${room}`);
        }

        // 2. Prevent joining if a game is already in progress
        if (rooms[room].status !== 'waiting') {
            socket.emit('roomError', 'Game already in progress in this room.');
            socket.leave(room);
            return;
        }

        // 3. Prevent room overcrowding (let's cap it at 4 players for now)
        if (rooms[room].players.length >= 4) {
            socket.emit('roomError', 'Room is full! Maximum 4 players.');
            socket.leave(room);
            return;
        }

        // 4. Add the player to the room's data structure
        rooms[room].players.push({
            id: socket.id,
            hand: [],
            score: 0,
            isReady: false,
            status: 'waiting' // 'waiting', 'playing', 'stayed', 'busted'
        });

        console.log(`[Multiplayer] Player ${socket.id} joined Room: ${room}`);

        // 5. Broadcast the updated room state to EVERYONE inside this specific room
        io.to(room).emit('roomUpdate', {
            roomName: room,
            players: rooms[room].players,
            status: rooms[room].status
        });
    });

    // Handle sudden disconnects while in a multiplayer room
    socket.on('disconnect', () => {
        if (currentRoomName && rooms[currentRoomName]) {
            // Remove the player from the room array
            rooms[currentRoomName].players = rooms[currentRoomName].players.filter(p => p.id !== socket.id);
            console.log(`[Multiplayer] Player ${socket.id} left Room: ${currentRoomName}`);

            // If the room is completely empty now, delete it to save server memory
            if (rooms[currentRoomName].players.length === 0) {
                delete rooms[currentRoomName];
                console.log(`[Multiplayer] Room ${currentRoomName} destroyed (Empty)`);
            } else {
                // Otherwise, tell remaining players someone left
                io.to(currentRoomName).emit('roomUpdate', {
                    roomName: currentRoomName,
                    players: rooms[currentRoomName].players,
                    status: rooms[currentRoomName].status
                });
            }
        }
    });

    // --- PLAYER READY HANDLER ---
    socket.on('playerReady', () => {
        if (!currentRoomName || !rooms[currentRoomName]) return;
        
        const room = rooms[currentRoomName];
        
        // Find the player who sent this event and flip their ready status
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.isReady = !player.isReady; // Toggle true/false
            console.log(`[Multiplayer] Player ${socket.id} set ready to: ${player.isReady}`);
        }

        // Check if EVERYONE in the room is now ready
        // (We also want to make sure there's at least 1 player)
        const allReady = room.players.length > 0 && room.players.every(p => p.isReady);

        if (allReady) {
            // Change room status so no one else can join mid-game
            room.status = 'playing';
            room.currentTurn = 0; // Reset turn counter to the first player
            room.deck = shuffle(createDeck()); // Fresh deck for the round
            room.dealerHand = [room.deck.pop(), room.deck.pop()];

            // Deal 2 cards to every player in the room
            room.players.forEach(p => {
                p.hand = p.hand = [room.deck.pop(), room.deck.pop()];
                p.score = calculateScore(p.hand);
                p.status = 'playing';
            });

            // Tell everyone the game is starting and send the initial hands!
            io.to(currentRoomName).emit('multiGameState', {
                players: room.players,
                dealerUpCard: room.dealerHand[0],
                currentTurnId: room.players[0].id // Player 1 goes first
            });
        } else {
            // If not everyone is ready, just broadcast the updated room list with the new ready statuses
            io.to(currentRoomName).emit('roomUpdate', {
                roomName: currentRoomName,
                players: room.players,
                status: room.status
            });
        }
    });
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});