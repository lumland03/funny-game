const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    render: { pixelArt: true, antialias: false },
    scene: { preload: preload, create: create }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.atlasXML('cardDeck', 'assets/playingCards.png', 'assets/playingCards.xml');
    this.load.atlasXML('cardBacks', 'assets/playingCardBacks.png', 'assets/playingCardBacks.xml');
}

function create() {
    this.socket = io();
    
    this.playerSprites = [];
    this.dealerSprites = [];
    this.playerCardCount = 0;
    this.playerScore = 0; 
    this.isRoundActive = false; 

    this.scoreText = this.add.text(400, 560, 'Score: 0', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    this.startButton = this.add.text(400, 300, 'START GAME', { fontSize: '32px', fill: '#0f0', backgroundColor: '#000', padding: 10 }).setOrigin(0.5).setInteractive();
    this.hitButton = this.add.text(300, 500, 'HIT', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 }).setOrigin(0.5).setInteractive().setVisible(false);
    this.stayButton = this.add.text(500, 500, 'STAY', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 }).setOrigin(0.5).setInteractive().setVisible(false);

    // Button Logic
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

    this.socket.off('gameState');
    this.socket.off('receiveCard');
    this.socket.off('dealerTurn');

    // --- 1. GAME STATE HANDLER ---
    this.socket.on('gameState', (data) => {
        this.playerSprites.forEach(s => s.destroy());
        this.dealerSprites.forEach(s => s.destroy());
        this.playerSprites = [];
        this.dealerSprites = [];
        this.playerCardCount = 0;
        this.playerScore = data.playerScore;

        // Draw Player Cards
        data.playerHand.forEach((card, index) => {
            const sprite = this.add.image(300 + (index * 70), 400, 'cardDeck', `card${card.suit}${card.value}.png`).setScale(0.7);
            this.playerSprites.push(sprite);
            this.playerCardCount++;
        });

        if (data.isBlackjack) {
            this.isRoundActive = false;
            this.hitButton.setVisible(false);
            this.stayButton.setVisible(false);

            // REVEAL DEALER CARDS (Using the data we added to server.js)
            data.fullDealerHand.forEach((card, index) => {
                const sprite = this.add.image(300 + (index * 70), 150, 'cardDeck', `card${card.suit}${card.value}.png`).setScale(0.7);
                this.dealerSprites.push(sprite);
            });

            this.scoreText.setText(`Score: 21 - BLACKJACK!`);
            const bjText = this.add.text(400, 300, 'BLACKJACK!', { fontSize: '48px', fill: '#ff0', backgroundColor: '#000', padding: 20 }).setOrigin(0.5);
            
            this.time.delayedCall(3000, () => {
                bjText.destroy();
                this.startButton.setText('PLAY AGAIN').setVisible(true);
            });
        } else {
            this.isRoundActive = true;
            this.hitButton.setVisible(true);
            this.stayButton.setVisible(true);
            this.scoreText.setText(`Score: ${this.playerScore}`);

            // Standard hidden card setup
            this.dealerSprites.push(this.add.image(300, 150, 'cardDeck', `card${data.dealerUpCard.suit}${data.dealerUpCard.value}.png`).setScale(0.7));
            this.dealerSprites.push(this.add.image(370, 150, 'cardBacks', 'cardBack_red2.png').setScale(0.7));
        }
    });

    // --- 2. RECEIVE CARD HANDLER ---
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

    // --- 3. DEALER TURN HANDLER ---
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
            resultText.destroy();
            this.startButton.setText('DEAL AGAIN?').setVisible(true);
        });
    });
}