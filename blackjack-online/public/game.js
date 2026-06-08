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
                this.socket.emit('requestCard');} else if (this.playerScore === 21) {
                this.hitButton.setVisible(false);  // ✅ Add this
                this.stayButton.setVisible(false); // ✅ Already there — just move it before the delayedCall
                this.time.delayedCall(500, () => {
            if (this.isRoundActive) this.socket.emit('stay');
    });
}
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

        // Fixed Ready Button (Added explicit Depth to make sure it always sits on top layer)
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
            
            // 🔥 FIXED THE BUG HERE: Force Phaser to dynamically adjust the click boundaries 
            // now that the text block is visible and populated.
            if (this.readyButton.input && this.readyButton.input.hitArea) {
                this.readyButton.input.hitArea.setTo(0, 0, this.readyButton.width, this.readyButton.height);
            }

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

            this.add.text(400, 150, 'GAME STARTING!', { fontSize: '36px', fill: '#0f0' }).setOrigin(0.5);
            
            let matchDetails = `Dealer shows: ${data.dealerUpCard.value} of ${data.dealerUpCard.suit}\n\n`;
            data.players.forEach((p, idx) => {
                matchDetails += `Player ${idx + 1} Hand: ${p.hand[0].value}, ${p.hand[1].value} (Score: ${p.score})\n`;
            });
            
            this.add.text(400, 350, matchDetails, { fontSize: '18px', fill: '#fff', align: 'center' }).setOrigin(0.5);
            console.log("Multiplayer Match Initialized:", data);
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