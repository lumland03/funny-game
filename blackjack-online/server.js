const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: function(origin, callback) {
            // Allow all origins (including localhost and Codespaces domains)
            callback(null, true);
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});
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
        // 🔧 FIX: Prevent Memory Leaks & Duplicate Event Listeners
        // Strip all game-specific listeners before switching modes
        const gameEvents = [
            'startGame', 'requestCard', 'stay', 
            'joinRoom', 'playerReady', 'playerHit', 
            'playerStay', 'getRoomStatus', 'leaveRoom'
        ];
        gameEvents.forEach(event => socket.removeAllListeners(event));

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
// SINGLE PLAYER WRAPPER
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
// MULTIPLAYER MANAGER (IMPROVED)
// ==========================================
function setupMultiplayerLogic(socket) {
    console.log(`[Mode] Socket ${socket.id} entered the Multiplayer Pool.`);
    
    let currentRoomName = null;

    socket.on('joinRoom', (roomName) => {
        const room = roomName.trim();
        if (!room) return;

        currentRoomName = room;
        socket.join(room);

        if (!rooms[room]) {
            rooms[room] = {
                deck: shuffle(createDeck()),
                players: [], 
                dealerHand: [],
                status: 'waiting',
                currentTurn: 0 
            };
            console.log(`[Multiplayer] Room Created: ${room}`);
        }

        if (rooms[room].status !== 'waiting') {
            socket.emit('roomError', 'Game already in progress in this room.');
            socket.leave(room);
            currentRoomName = null;
            return;
        }

        if (rooms[room].players.length >= 4) {
            socket.emit('roomError', 'Room is full! Maximum 4 players.');
            socket.leave(room);
            currentRoomName = null;
            return;
        }

        rooms[room].players.push({
            id: socket.id,
            hand: [],
            score: 0,
            isReady: false,
            status: 'waiting'
        });

        console.log(`[Multiplayer] Player ${socket.id} joined Room: ${room}`);

        io.to(room).emit('roomUpdate', {
            roomName: room,
            players: rooms[room].players,
            status: rooms[room].status
        });
    });

    socket.on('playerReady', () => {
        if (!currentRoomName || !rooms[currentRoomName]) return;
        
        const room = rooms[currentRoomName];
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.isReady = !player.isReady;
        }

        const allReady = room.players.length >= 2 && room.players.every(p => p.isReady);

        if (allReady) {
            room.status = 'playing';
            room.currentTurn = 0;
            
            // 🔧 FIX: Preserve shoe! Only reshuffle if running low on cards
            if (room.deck.length < 25) room.deck = shuffle(createDeck());
            
            room.dealerHand = [room.deck.pop(), room.deck.pop()];

            room.players.forEach(p => {
                p.hand = [room.deck.pop(), room.deck.pop()];
                p.score = calculateScore(p.hand);
                
                // 🔧 FIX: Handle natural Blackjacks automatically
                p.status = (p.score === 21) ? 'stayed' : 'playing';
            });

            // Make sure we skip the turn of anyone who automatically got blackjack
            advanceTurnIfNeeded(currentRoomName);

            io.to(currentRoomName).emit('multiGameState', {
                players: room.players,
                dealerUpCard: room.dealerHand[0],
                dealerHand: room.dealerHand,
                // Ensure we send the ID of whoever's actual turn it is now
                currentTurnId: room.players[room.currentTurn] ? room.players[room.currentTurn].id : null
            });
        } else {
            io.to(currentRoomName).emit('roomUpdate', {
                roomName: currentRoomName,
                players: room.players,
                status: room.status
            });
        }
    });

    socket.on('playerHit', () => {
        if (!currentRoomName || !rooms[currentRoomName]) return;
        const room = rooms[currentRoomName];
        const player = room.players.find(p => p.id === socket.id);
        
        if (!player || player.status !== 'playing') return;
        
        // 🔧 FIX: Enforce Turns
        if (room.players[room.currentTurn].id !== socket.id) return; 

        if (room.deck.length < 1) room.deck = shuffle(createDeck());
        const card = room.deck.pop();
        player.hand.push(card);
        player.score = calculateScore(player.hand);
        
        if (player.score > 21) {
            player.status = 'busted';
            io.to(currentRoomName).emit('playerUpdate', {
                playerId: socket.id,
                hand: player.hand,
                score: player.score,
                status: player.status
            });
            // Auto advance turn if busted
            advanceTurn(currentRoomName);
        } else {
            io.to(currentRoomName).emit('playerUpdate', {
                playerId: socket.id,
                hand: player.hand,
                score: player.score,
                status: player.status
            });
        }
    });

    socket.on('playerStay', () => {
        if (!currentRoomName || !rooms[currentRoomName]) return;
        const room = rooms[currentRoomName];
        const player = room.players.find(p => p.id === socket.id);
        
        if (!player) return;
        
        // 🔧 FIX: Enforce Turns
        if (room.players[room.currentTurn].id !== socket.id) return; 

        player.status = 'stayed';
        io.to(currentRoomName).emit('playerUpdate', {
            playerId: socket.id,
            status: 'stayed'
        });
        
        advanceTurn(currentRoomName);
    });

    socket.on('getRoomStatus', (roomName) => {
        if (!rooms[roomName]) return;
        io.to(roomName).emit('roomUpdate', {
            roomName: roomName,
            players: rooms[roomName].players,
            status: rooms[roomName].status
        });
    });

    socket.on('leaveRoom', () => {
        handlePlayerLeave(socket);
    });

    socket.on('disconnect', () => {
        handlePlayerLeave(socket);
    });

    // --- HELPER: Turn Management ---
    // 🔧 FIX: New function to manage multiplayer turns correctly
    function advanceTurn(roomName) {
        const room = rooms[roomName];
        if (!room) return;
        
        room.currentTurn++;
        advanceTurnIfNeeded(roomName);
    }

    function advanceTurnIfNeeded(roomName) {
        const room = rooms[roomName];
        if (!room) return;

        if (room.currentTurn >= room.players.length) {
            checkGameEnd(roomName);
        } else {
            const nextPlayer = room.players[room.currentTurn];
            if (nextPlayer.status !== 'playing') {
                advanceTurn(roomName); // Skip over players who busted or got blackjack
            } else {
                io.to(roomName).emit('turnChange', { currentTurnId: nextPlayer.id });
            }
        }
    }

    // --- HELPER: Disconnect / Leave Handling ---
    function handlePlayerLeave(disconnectedSocket) {
        if (currentRoomName && rooms[currentRoomName]) {
            const room = rooms[currentRoomName];
            room.players = room.players.filter(p => p.id !== disconnectedSocket.id);
            console.log(`[Multiplayer] Player ${disconnectedSocket.id} left Room: ${currentRoomName}`);

            if (room.players.length === 0) {
                delete rooms[currentRoomName];
                console.log(`[Multiplayer] Room ${currentRoomName} destroyed (Empty)`);
            } else {
                io.to(currentRoomName).emit('roomUpdate', {
                    roomName: currentRoomName,
                    players: room.players,
                    status: room.status
                });

                // 🔧 FIX: Prevent game hang if someone disconnects mid-game
                if (room.status === 'playing') {
                    // Check if the remaining players are already done
                    const allFinished = room.players.every(p => p.status === 'stayed' || p.status === 'busted');
                    if (allFinished) {
                        checkGameEnd(currentRoomName);
                    }
                }
            }
            disconnectedSocket.leave(currentRoomName);
            currentRoomName = null;
        }
    }

    // --- HELPER: Check if game should end ---
    function checkGameEnd(roomName) {
        const room = rooms[roomName];
        if (!room) return;

        const allFinished = room.players.every(p => p.status === 'stayed' || p.status === 'busted');
        
        if (allFinished) {
            let dScore = calculateScore(room.dealerHand);
            while (dScore < 17) {
                if (room.deck.length < 1) room.deck = shuffle(createDeck());
                room.dealerHand.push(room.deck.pop());
                dScore = calculateScore(room.dealerHand);
            }
            
            const results = room.players.map(p => {
                let result = '';
                if (p.status === 'busted') {
                    result = 'Busted!';
                } else if (dScore > 21) {
                    result = 'Won!';
                } else if (p.score > dScore) {
                    result = 'Won!';
                } else if (p.score < dScore) {
                    result = 'Lost!';
                } else {
                    result = 'Push!';
                }
                return { playerId: p.id, result, dealerScore: dScore };
            });
            
            io.to(roomName).emit('gameResults', {
                dealerHand: room.dealerHand,
                results: results
            });

            setTimeout(() => {
                if (rooms[roomName]) {
                    console.log(`[Multiplayer] Resetting Room ${roomName} for next round`);
                    room.status = 'waiting';
                    room.dealerHand = [];
                    // 🔧 FIX: Do NOT recreate the deck completely here. Let it persist for the next round.
                    
                    room.players.forEach(p => {
                        p.hand = [];
                        p.score = 0;
                        p.isReady = false;
                        p.status = 'waiting';
                    });
                }
            }, 3000);
        }
    }
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is live at http://0.0.0.0:${PORT}`);
});