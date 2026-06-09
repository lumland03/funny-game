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
// ==========================================
// Add this AFTER the stayButton creation
// ==========================================

// Menu Button (top-left corner)
const menuButton = this.add.text(30, 30, '⬅ MENU', { 
    fontSize: '16px', 
    fill: '#fff', 
    backgroundColor: '#333',
    padding: { x: 10, y: 8 }
}).setOrigin(0, 0).setInteractive().setDepth(100);

menuButton.on('pointerdown', () => {
    // Clean up any lingering socket listeners
    this.socket.off('gameState');
    this.socket.off('receiveCard');
    this.socket.off('dealerTurn');
    
    // Return to main menu
    this.scene.start('MainMenuScene');
});
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
// 3. MULTIPLAYER SCENE (CORRECTED)
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

        // Store game state
        this.currentRoom = null;
        this.myPlayerId = this.socket.id;
        this.gameActive = false;
        this.playerCardSprites = {}; 
        this.playerPositionMap = {}; 
        this.gameContainer = null; 

        // UI Text Components
        this.statusText = this.add.text(400, 30, 'MULTIPLAYER LOBBY', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.lobbyInfoText = this.add.text(400, 100, 'Connecting to multiplayer pool...', { fontSize: '16px', fill: '#aaa', align: 'center' }).setOrigin(0.5);

        // Fixed Ready Button
        this.readyButton = this.add.text(400, 550, 'TAP TO READY UP', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 12 })
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
                this.currentRoom = roomName;
                this.socket.emit('joinRoom', roomName);
            } else {
                this.scene.start('MainMenuScene');
            }
        });

        // --- NETWORK EVENT LISTENERS ---
        this.socket.on('roomUpdate', (data) => {
            this.readyButton.setVisible(true); 

            let playerListString = `Room: ${data.roomName}\n\nConnected Players (${data.players.length}/4):\n`;
            data.players.forEach((player, index) => {
                const isMe = player.id === this.socket.id ? " (You)" : "";
                const readyStatus = player.isReady ? "✅ READY" : "⏳ Waiting...";
                
                playerListString += `${index + 1}. ID: ${player.id.substring(0, 5)}...${isMe} ── ${readyStatus}\n`;
            });

            this.lobbyInfoText.setText(playerListString);
        });

        this.socket.on('multiGameState', (data) => {
            this.gameActive = true;
            this.statusText.setText('MULTIPLAYER GAME!');
            this.statusText.setFill('#0f0');
            this.lobbyInfoText.setVisible(false);
            this.readyButton.setVisible(false);

            // Create container for game scene
            if (this.gameContainer) {
                this.gameContainer.destroy();
            }
            this.gameContainer = this.add.container(0, 0);

            // 🔧 FIX: Render only the upcard and one face-down card
            const dealerLabel = this.add.text(400, 20, 'DEALER', { fontSize: '20px', fill: '#ff6b6b', fontStyle: 'bold' });
            dealerLabel.setOrigin(0.5);
            this.gameContainer.add(dealerLabel);

            const dealerCardX = 320;
            // Show Up Card
            const upCardSprite = this.add.image(dealerCardX, 80, 'cardDeck', `card${data.dealerUpCard.suit}${data.dealerUpCard.value}.png`).setScale(0.8);
            // Show Hole Card (Face Down)
            const holeCardSprite = this.add.image(dealerCardX + 90, 80, 'cardBacks', 'cardBack_red2.png').setScale(0.8);
            holeCardSprite.setName('dealerHoleCard'); // Tag it so we can flip it later!

            this.gameContainer.add([upCardSprite, holeCardSprite]);

            // IMPROVED LAYOUT: Better spacing to prevent overlap
            const playerLayout = [
                { x: 120, y: 220, label: 'Player 1' },
                { x: 680, y: 220, label: 'Player 2' },
                { x: 120, y: 420, label: 'Player 3' },
                { x: 680, y: 420, label: 'Player 4' }
            ];

            // Initialize card sprite tracking and position mapping for each player
            data.players.forEach((player, playerIdx) => {
                this.playerCardSprites[player.id] = [];
                this.playerPositionMap[player.id] = playerLayout[playerIdx]; 
                
                const pos = playerLayout[playerIdx];
                const isYou = player.id === this.socket.id ? " (YOU)" : "";
                const playerColor = player.id === this.socket.id ? '#00ff00' : '#aaaaaa';
                
                // Player label
                const label = this.add.text(pos.x, pos.y - 40, pos.label + isYou, { fontSize: '14px', fill: playerColor, fontStyle: 'bold' });
                label.setOrigin(0.5);
                this.gameContainer.add(label);
                
                // Draw initial cards
                player.hand.forEach((card, cardIdx) => {
                    const cardSprite = this.add.image(
                        pos.x + (cardIdx * 60),
                        pos.y,
                        'cardDeck',
                        `card${card.suit}${card.value}.png`
                    ).setScale(0.7);
                    this.gameContainer.add(cardSprite);
                    this.playerCardSprites[player.id].push(cardSprite);
                });

                // Player score
                const scoreText = this.add.text(pos.x, pos.y + 80, `Score: ${player.score}`, 
                    { fontSize: '16px', fill: '#fff', fontStyle: 'bold' });
                scoreText.setOrigin(0.5);
                scoreText.setName(`score_${player.id}`); // Tag for easy updates
                this.gameContainer.add(scoreText);
            });

            // 🔧 FIX: Start with buttons hidden, only show if it is YOUR turn
            this.hitButton = this.add.text(300, 550, 'HIT', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 })
                .setOrigin(0.5)
                .setInteractive()
                .setDepth(10)
                .setVisible(false);

            this.stayButton = this.add.text(500, 550, 'STAY', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 })
                .setOrigin(0.5)
                .setInteractive()
                .setDepth(10)
                .setVisible(false);

            if (data.currentTurnId === this.socket.id) {
                this.hitButton.setVisible(true);
                this.stayButton.setVisible(true);
            }

            this.hitButton.on('pointerdown', () => {
                if (this.gameActive) {
                    this.socket.emit('playerHit');
                }
            });

            this.stayButton.on('pointerdown', () => {
                if (this.gameActive) {
                    this.socket.emit('playerStay');
                    this.hitButton.setVisible(false);
                    this.stayButton.setVisible(false);
                }
            });

            console.log("Multiplayer Match Initialized:", data);
        });

        // 🔧 FIX: Listen for turn changes to toggle UI buttons
        this.socket.on('turnChange', (data) => {
            console.log(`It is now player ${data.currentTurnId}'s turn.`);
            if (data.currentTurnId === this.socket.id) {
                this.hitButton.setVisible(true);
                this.stayButton.setVisible(true);
            } else {
                if (this.hitButton) this.hitButton.setVisible(false);
                if (this.stayButton) this.stayButton.setVisible(false);
            }
        });

        this.socket.on('playerUpdate', (data) => {
            console.log(`Player ${data.playerId} updated:`, data);
            
            // Update score text
            const scoreText = this.gameContainer.getByName(`score_${data.playerId}`);
            if (scoreText && data.score !== undefined) {
                scoreText.setText(`Score: ${data.score}`);
                
                // Flash the score if it's a bust
                if (data.status === 'busted') {
                    scoreText.setFill('#ff0000');
                }
            }

            // If new cards were drawn, add them to the display
            if (data.hand) {
                const pos = this.playerPositionMap[data.playerId];
                
                if (!pos) {
                    console.warn(`No position found for player ${data.playerId}`);
                    return;
                }

                // Destroy old card sprites
                if (this.playerCardSprites[data.playerId]) {
                    this.playerCardSprites[data.playerId].forEach(sprite => sprite.destroy());
                    this.playerCardSprites[data.playerId] = [];
                }

                // Draw updated cards with a slight animation
                data.hand.forEach((card, cardIdx) => {
                    const cardSprite = this.add.image(
                        pos.x + (cardIdx * 60),
                        pos.y,
                        'cardDeck',
                        `card${card.suit}${card.value}.png`
                    ).setScale(0.7);
                    
                    // Animate new card appearing
                    this.tweens.add({
                        targets: cardSprite,
                        scale: { from: 0.3, to: 0.7 },
                        duration: 300,
                        ease: 'Back.out'
                    });

                    this.gameContainer.add(cardSprite);
                    this.playerCardSprites[data.playerId].push(cardSprite);
                });
            }
        });

        this.socket.on('gameResults', (data) => {
            this.gameActive = false;
            if (this.hitButton) this.hitButton.setVisible(false);
            if (this.stayButton) this.stayButton.setVisible(false);

            // 🔧 FIX: Reveal dealer's hidden card and any new drawn cards
            const holeCard = this.gameContainer.getByName('dealerHoleCard');
            if (holeCard) holeCard.destroy(); // Remove the face-down card

            const dealerCardX = 320;
            data.dealerHand.forEach((card, idx) => {
                // Skip index 0 since the upcard is already there
                if (idx > 0) { 
                    const sprite = this.add.image(dealerCardX + (idx * 90), 80, 'cardDeck', `card${card.suit}${card.value}.png`).setScale(0.8);
                    this.gameContainer.add(sprite);
                }
            });

            // Show results screen
            const resultsBg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
            resultsBg.setDepth(100);

            const resultsTitle = this.add.text(400, 100, 'ROUND OVER!', { fontSize: '48px', fill: '#ffff00', fontStyle: 'bold' });
            resultsTitle.setOrigin(0.5).setDepth(101);
            
            const dealerCardsStr = data.dealerHand.map(c => `${c.value}${c.suit[0]}`).join(', ');
            let resultsStr = `DEALER: ${dealerCardsStr}\n\n`;
            
            data.results.forEach((result, idx) => {
                const status = result.result === 'Won!' ? '✅' : result.result === 'Push!' ? '➖' : '❌';
                resultsStr += `Player ${idx + 1}: ${status} ${result.result}\n`;
            });

            const resultsText = this.add.text(400, 250, resultsStr, { 
                fontSize: '18px', 
                fill: '#fff', 
                align: 'center',
                lineSpacing: 10
            });
            resultsText.setOrigin(0.5).setDepth(101);

            // Play Again Button
            const playAgainBtn = this.add.text(400, 480, 'READY FOR NEXT ROUND?', { 
                fontSize: '20px', 
                fill: '#fff', 
                backgroundColor: '#0f0', 
                padding: 15,
                align: 'center'
            }).setOrigin(0.5).setInteractive().setDepth(101);

            playAgainBtn.on('pointerdown', () => {
                // Destroy results screen
                resultsBg.destroy();
                resultsTitle.destroy();
                resultsText.destroy();
                playAgainBtn.destroy();

                // Return to lobby
                this.returnToLobby();
            });

            // Back to Menu Button
            const menuBtn = this.add.text(400, 530, 'BACK TO MENU', { 
                fontSize: '16px', 
                fill: '#aaa', 
                backgroundColor: '#333', 
                padding: 10,
                align: 'center'
            }).setOrigin(0.5).setInteractive().setDepth(101);

            menuBtn.on('pointerdown', () => {
                this.socket.emit('leaveRoom');
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
            this.socket.off('turnChange'); // 🔧 FIX: Added missing turnChange cleanup
            this.socket.off('playerUpdate');
            this.socket.off('gameResults');
        });
    }

    returnToLobby() {
        this.gameActive = false;

        // Destroy game container
        if (this.gameContainer) {
            this.gameContainer.destroy();
        }

        // Hide game buttons
        if (this.hitButton) this.hitButton.setVisible(false);
        if (this.stayButton) this.stayButton.setVisible(false);

        // Reset state
        this.statusText.setText('MULTIPLAYER LOBBY');
        this.statusText.setFill('#fff');
        this.lobbyInfoText.setVisible(true);
        this.readyButton.setVisible(true);

        // Request updated room state from server
        this.socket.emit('getRoomStatus', this.currentRoom);
        
    }
}
// ==========================================
// 4. PHASER CONFIGURATION
// ==========================================
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1200,
    height: 800,
    backgroundColor: '#2d2d2d',
    render: { pixelArt: true, antialias: false },
    scene: [MainMenuScene, SinglePlayerScene, MultiplayerScene] 
};

const game = new Phaser.Game(config);