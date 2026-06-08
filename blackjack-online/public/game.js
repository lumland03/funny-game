// ==========================================
// 0. GLOBAL NETWORK INITIALIZATION
// ==========================================
const socket = io();

// ==========================================
// 1. MAIN MENU SCENE
// ==========================================
class MainMenuScene extends Phaser.Scene {
    constructor() { super('MainMenuScene'); }

    create() {
        this.add.text(400, 150, 'BLINDING BLACKJACK', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);

        // Single Player Button
        const spButton = this.add.text(400, 300, 'SINGLE PLAYER', { fontSize: '28px', fill: '#0f0', backgroundColor: '#000', padding: 15 }).setOrigin(0.5).setInteractive();
        spButton.on('pointerdown', () => {
            this.scene.start('SinglePlayerScene');
        });

        // Multiplayer Button
        const mpButton = this.add.text(400, 420, 'MULTIPLAYER', { fontSize: '28px', fill: '#00f', backgroundColor: '#000', padding: 15 }).setOrigin(0.5).setInteractive();
        mpButton.on('pointerdown', () => {
            this.scene.start('MultiplayerScene');
        });
    }
}

// ==========================================
// 2. SINGLE PLAYER SCENE
// ==========================================
class SinglePlayerScene extends Phaser.Scene {
    constructor() { super('SinglePlayerScene'); }

    preload() {
        this.load.atlasXML('cardDeck', 'assets/playingCards.png', 'assets/playingCards.xml');
        this.load.atlasXML('cardBacks', 'assets/playingCardBacks.png', 'assets/playingCardBacks.xml');
    }

    create() {
        this.socket = socket;
        this.socket.emit('modeSelection', 'single'); 
        
        this.playerSprites = [];
        this.dealerSprites = [];
        this.playerCardCount = 0;
        this.playerScore = 0; 
        this.isRoundActive = false; 

        // UI Components
        this.scoreText = this.add.text(400, 560, 'Score: 0', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        this.startButton = this.add.text(400, 300, 'START GAME', { fontSize: '32px', fill: '#0f0', backgroundColor: '#000', padding: 10 }).setOrigin(0.5).setInteractive();
        this.hitButton = this.add.text(300, 500, 'HIT', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 }).setOrigin(0.5).setInteractive().setVisible(false);
        this.stayButton = this.add.text(500, 500, 'STAY', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 }).setOrigin(0.5).setInteractive().setVisible(false);

        // Input Logic
        this.startButton.on('pointerdown', () => {
            this.socket.emit('startGame');
            this.startButton.setVisible(false);
        });

        this.hitButton.on('pointerdown', () => {
            if (this.isRoundActive && this.playerScore < 21) {
                this.socket.emit('requestCard');
            }
        });

        this.stayButton.on('pointerdown', () => {
            if(this.isRoundActive) {
                this.socket.emit('stay');
                this.hitButton.setVisible(false);
                this.stayButton.setVisible(false);
            }
        });

        // --- NETWORK EVENT LISTENERS ---
        this.socket.on('gameState', (data) => {
            this.playerSprites.forEach(s => s.destroy());
            this.dealerSprites.forEach(s => s.destroy());
            this.playerSprites = [];
            this.dealerSprites = [];
            this.playerCardCount = 0;
            this.playerScore = data.playerScore;

            data.playerHand.forEach((card, index) => {
                const sprite = this.add.image(300 + (index * 70), 400, 'cardDeck', `card${card.suit}${card.value}.png`).setScale(0.7);
                this.playerSprites.push(sprite);
                this.playerCardCount++;
            });

            if (data.isBlackjack) {
                this.isRoundActive = false;
                this.hitButton.setVisible(false);
                this.stayButton.setVisible(false);

                data.fullDealerHand.forEach((card, index) => {
                    const sprite = this.add.image(300 + (index * 70), 150, 'cardDeck', `card${card.suit}${card.value}.png`).setScale(0.7);
                    this.dealerSprites.push(sprite);
                });

                this.scoreText.setText(`Score: 21 - BLACKJACK!`);
                const bjText = this.add.text(400, 300, 'BLACKJACK!', { fontSize: '48px', fill: '#ff0', backgroundColor: '#000', padding: 20 }).setOrigin(0.5);
                
                this.time.delayedCall(3000, () => {
                    if (bjText) bjText.destroy();
                    this.startButton.setText('PLAY AGAIN').setVisible(true);
                });
            } else {
                this.isRoundActive = true;
                this.hitButton.setVisible(true);
                this.stayButton.setVisible(true);
                this.scoreText.setText(`Score: ${this.playerScore}`);

                if (data.dealerUpCard) {
                    this.dealerSprites.push(this.add.image(300, 150, 'cardDeck', `card${data.dealerUpCard.suit}${data.dealerUpCard.value}.png`).setScale(0.7));
                }
                this.dealerSprites.push(this.add.image(370, 150, 'cardBacks', 'cardBack_red2.png').setScale(0.7));
            }
        });

        this.socket.on('receiveCard', (data) => {
            if (!this.isRoundActive) return;

            this.playerScore = data.score;
            const sprite = this.add.image(300 + (this.playerCardCount * 70), 400, 'cardDeck', `card${data.card.suit}${data.card.value}.png`).setScale(0.7);
            this.playerSprites.push(sprite);
            this.playerCardCount++;
            this.scoreText.setText(`Score: ${this.playerScore}`);

            if (data.isBust) {
                this.isRoundActive = false;
                this.scoreText.setText(`Score: ${this.playerScore} - BUSTED!`);
                this.hitButton.setVisible(false);
                this.stayButton.setVisible(false);
                this.time.delayedCall(1500, () => this.startButton.setText('TRY AGAIN?').setVisible(true));
            } else if (this.playerScore === 21) {
                this.hitButton.setVisible(false);
                this.stayButton.setVisible(false); 
                this.time.delayedCall(500, () => {
                    if (this.isRoundActive) this.socket.emit('stay');
                });
            }
        });

        this.socket.on('dealerTurn', (data) => {
            this.isRoundActive = false;
            this.dealerSprites.forEach(s => s.destroy());
            this.dealerSprites = [];

            data.fullDealerHand.forEach((card, index) => {
                const sprite = this.add.image(300 + (index * 70), 150, 'cardDeck', `card${card.suit}${card.value}.png`).setScale(0.7);
                this.dealerSprites.push(sprite);
            });

            const resultText = this.add.text(400, 300, data.result, { fontSize: '40px', fill: '#ff0', backgroundColor: '#000', padding: 20 }).setOrigin(0.5);
            this.scoreText.setText(`Final - Dealer: ${data.dealerScore}`);

            this.time.delayedCall(3000, () => {
                if (resultText) resultText.destroy();
                this.startButton.setText('DEAL AGAIN?').setVisible(true);
            });
        });

        // --- LIFECYCLE CLEANUP ---
        this.events.on('shutdown', () => {
            this.socket.off('gameState');
            this.socket.off('receiveCard');
            this.socket.off('dealerTurn');
        });
    }
}

// ==========================================
// 3. MULTIPLAYER SCENE
// ==========================================
class MultiplayerScene extends Phaser.Scene {
    constructor() { super('MultiplayerScene'); }

    preload() {
        this.load.atlasXML('cardDeck', 'assets/playingCards.png', 'assets/playingCards.xml');
        this.load.atlasXML('cardBacks', 'assets/playingCardBacks.png', 'assets/playingCardBacks.xml');
    }

    create() {
        this.socket = socket;
        this.socket.emit('modeSelection', 'multi');

        // UI Text Components
        this.statusText = this.add.text(400, 100, 'MULTIPLAYER LOBBY', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.lobbyInfoText = this.add.text(400, 240, 'Connecting to multiplayer pool...', { fontSize: '18px', fill: '#aaa', align: 'center' }).setOrigin(0.5);

        // Fixed Ready Button
        this.readyButton = this.add.text(400, 500, 'TAP TO READY UP', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 12 })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false)
            .setDepth(10);
        
        this.readyButton.on('pointerdown', () => {
            this.socket.emit('playerReady');
        });

        // Trigger the room prompt
        this.time.delayedCall(500, () => {
            const roomName = prompt("Enter a Room Name to create or join (e.g., Room1):");
            if (roomName) {
                this.socket.emit('joinRoom', roomName);
            } else {
                this.scene.start('MainMenuScene');
            }
        });

        // --- NETWORK EVENT LISTENERS ---
        this.socket.on('roomUpdate', (data) => {
            this.readyButton.setVisible(true); 

            let playerListString = `Room: ${data.roomName}\n\nConnected Players:\n`;
            data.players.forEach((player, index) => {
                const isMe = player.id === this.socket.id ? " (You)" : "";
                const readyStatus = player.isReady ? "✅ READY" : "⏳ Waiting...";
                
                playerListString += `${index + 1}. ID: ${player.id.substring(0, 5)}...${isMe} ── ${readyStatus}\n`;
            });

            this.lobbyInfoText.setText(playerListString);
        });

        this.socket.on('multiGameState', (data) => {
            this.statusText.setVisible(false);
            this.lobbyInfoText.setVisible(false);
            this.readyButton.setVisible(false);

            // Store for updates
            this.multiPlayers = data.players;
            this.myPlayerId = this.socket.id;
            this.multiGameActive = true;

            this.add.text(400, 50, 'MULTIPLAYER GAME START!', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5);

            // ✅ RENDER DEALER CARDS AT TOP
            this.add.text(400, 90, 'Dealer', { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);
            data.dealerHand.forEach((card, idx) => {
                this.add.image(
                    250 + (idx * 80),
                    130,
                    'cardDeck',
                    `card${card.suit}${card.value}.png`
                ).setScale(0.7);
            });

            // ✅ RENDER EACH PLAYER'S CARDS
            const playerPositions = [
                { x: 150, y: 280, label: 'Player 1' },
                { x: 500, y: 280, label: 'Player 2' },
                { x: 150, y: 450, label: 'Player 3' },
                { x: 500, y: 450, label: 'Player 4' }
            ];

            data.players.forEach((player, playerIdx) => {
                const pos = playerPositions[playerIdx];
                const isYou = player.id === this.socket.id ? " (YOU)" : "";
                
                this.add.text(pos.x, pos.y - 30, pos.label + isYou, { fontSize: '16px', fill: '#aaa' }).setOrigin(0.5);
                
                player.hand.forEach((card, cardIdx) => {
                    this.add.image(
                        pos.x + (cardIdx * 50),
                        pos.y,
                        'cardDeck',
                        `card${card.suit}${card.value}.png`
                    ).setScale(0.65);
                });

                this.add.text(pos.x, pos.y + 60, `Score: ${player.score}`, { fontSize: '14px', fill: '#fff' }).setOrigin(0.5);
            });

            // ✅ ADD HIT/STAY BUTTONS FOR CURRENT PLAYER
            this.hitButton = this.add.text(300, 550, 'HIT', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 })
                .setOrigin(0.5)
                .setInteractive()
                .setDepth(10);

            this.stayButton = this.add.text(500, 550, 'STAY', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 })
                .setOrigin(0.5)
                .setInteractive()
                .setDepth(10);

            this.hitButton.on('pointerdown', () => {
                if (this.multiGameActive) {
                    this.socket.emit('playerHit');
                }
            });

            this.stayButton.on('pointerdown', () => {
                if (this.multiGameActive) {
                    this.socket.emit('playerStay');
                    this.hitButton.setVisible(false);
                    this.stayButton.setVisible(false);
                }
            });
        });

        // ✅ HANDLE PLAYER UPDATES (cards/score changes)
        this.socket.on('playerUpdate', (data) => {
            console.log(`Player ${data.playerId} updated:`, data);
            // Update local player state
            const player = this.multiPlayers.find(p => p.id === data.playerId);
            if (player) {
                player.hand = data.hand || player.hand;
                player.score = data.score !== undefined ? data.score : player.score;
                player.status = data.status || player.status;
            }
            
            // Optionally rebuild the display (for now just log)
            // In a full implementation, you'd animate new cards or update scores
        });

        // ✅ HANDLE GAME RESULTS
        this.socket.on('gameResults', (data) => {
            this.multiGameActive = false;
            this.hitButton.setVisible(false);
            this.stayButton.setVisible(false);

            this.add.text(400, 250, 'ROUND OVER', { fontSize: '40px', fill: '#ff0' }).setOrigin(0.5);
            
            const dealerCardsStr = data.dealerHand.map(c => `${c.value}${c.suit[0]}`).join(', ');
            let resultsStr = `Dealer: ${dealerCardsStr}\n\n`;
            
            data.results.forEach((result, idx) => {
                resultsStr += `Player ${idx + 1}: ${result.result}\n`;
            });

            this.add.text(400, 350, resultsStr, { fontSize: '18px', fill: '#fff', align: 'center' }).setOrigin(0.5);

            this.time.delayedCall(3000, () => {
                this.scene.start('MainMenuScene');
            });
        });

        this.socket.on('roomError', (errorMessage) => {
            alert(errorMessage);
            this.scene.start('MainMenuScene');
        });

        // --- LIFECYCLE CLEANUP ---
        this.events.on('shutdown', () => {
            this.socket.off('roomUpdate');
            this.socket.off('roomError');
            this.socket.off('multiGameState');
            this.socket.off('playerUpdate');
            this.socket.off('gameResults');
        });
    }
}

// ==========================================
// 4. CORE CONFIGURATION
// ==========================================
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    render: { pixelArt: true, antialias: false },
    scene: [MainMenuScene, SinglePlayerScene, MultiplayerScene] 
};

const game = new Phaser.Game(config);