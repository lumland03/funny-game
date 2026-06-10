# Landon Umland

# idea board

## funny gambling website

Would be like 90% vibe coded because I have no idea how this would actually work

## Game Flow

Intro: Players join in lobby and adjust settings what not

You are forced to lose all money you start with (potentially randomize starting money for fun or something)

Only option left is a knife on the table where you are prompted to gamble with your body parts

Place bet before the next round

Once players confirm their bets the game of BlackJack starts like normal.

repeat until someone runs out of limbs or quit

### Blackjack Rules

In Blackjack, everyone plays against the dealer. Players receive all cards face up, and the dealer’s first card is face up and the second is face down. The object of the game is to get closer to 21 than the dealer without going over 21. If a hand goes over 21, it is called a “bust” or “break,” and the wager is lost. In 21, Jacks, Queens, Kings, and 10s count as 10. An Ace may be played as a one or an 11. All other cards are played at face value.

When you receive your first two cards, you may either “stand” or “hit.” When you “stand,” it means you feel you are close enough to 21 and no longer wish any additional cards, indicated by waving off with your hand. If you wish to receive another card or “hit,” tap or scratch the table behind your wager with your finger.  In either situation, you will never touch the cards; everything is communicated using hand signals. You may draw as many cards as you want until you are close to 21 or until you “bust.”

If you are closer to 21 than the dealer, you win and are paid an amount equal to your original wager. If your hand is less than the dealer’s, you lose. If the dealer’s hand “busts” or “breaks,” you win as well. Ties are a standoff or “push,” and your bet remains on the table.

If your initial two cards total 21, any Ace with a 10, Jack, Queen, or King, you have a Blackjack. Blackjack is paid either 6 to 5 or 3 to 2, depending on the type of Blackjack you are playing.

In 21, the player has many options to choose from:\
\
 

### Splitting Pairs

If your first two cards have the same numerical value, you may split them into two hands. The second hand’s bet must be equal to the original bet. If the split pair is Aces, you are limited to a one-card draw on each hand.

\
 

### Doubling Down

You can double down in blackjack after receiving your first two cards. You may elect to wager an additional amount not to exceed the value of the original bet. With a double down, you will be dealt one additional card only.\
 

### Insurance

If the dealer’s face-up card is an Ace, you may elect to take insurance. Insurance in blackjack is a wager that the dealer has a blackjack. You may bet up to one-half of your original bet. Insurance bets pay 2 to 1 if the dealer has a blackjack, but lose in all other instances.\
 

### Surrender

Players have the option of surrendering one half of their original wager after receiving their first two cards. If you surrender your cards, the dealer will take half of your wager. (Note: The Surrender option is not available in the Double Deck game.)

Black Jack is paid more than normal bets

Splitting has to be 2 of the same number, aces can only draw 1 card each.

Double down you bet up to the original bet and draw one more card - no more drawing after

If showing Ace you can place half of your original bet if the dealer has BJ if they do you win 2-1 if they dont you lose the insurance wager

Loser shit

NOTE FOR ME: I AM BAD AT FUNCTIONS -- GET BETTER AT THEM IDOT

DONT HARD CODE

[GSAP | Docs & Learning](https://gsap.com/cheatsheet)

GSAP Cheat Sheet

## Territory

# New Board

- **Territory title:** maximum 8 words.

- **One-sentence curiosity statement:** maximum 25 words.

- **Short paragraph:** 3-5 sentences about why it matters, what tension you are curious about, and where it could lead.

- **Three possible directions:** possible outcomes this inquiry could eventually become.

- **One AI evidence item:** screenshot, prompt experiment, generated output, workflow diagram, or AI-produced question list.

- **Three feedback questions:** what you want classmates to help you answer.

In depth web designing

I want to mess around more with websites and using JS and games stuff

I think it matters because I like acting on stupid ideas that I have. I want to be able to act on any idea that I have web dev wise and know its possible. 

This could potentially lead to a career in more game design and other coding avenues. Or at least lead into more of a back end coding interest





![AI generated me a game plan of what programs or software to use](https://app.milanote.com/media/p/images/1Wia0L1Qwx2928/rLV/Screenshot%202026-04-29%20at%2011.51.47%E2%80%AFAM.png?w=800)

What should I use the AI for

Am I missing anything obvious that might not be a good choice for this project

Should I use the AI for design or keep it coding focused



# Flow temp

## Day 1

## Day 2

## Day 3

## Day 4

# Command Center


- **Sources:**

    - Node API Reference: [Node Docs](https://nodejs.org/docs/latest/api/)

    - Phaser Engine: [Phaser Docs](https://docs.phaser.io/)

    - Socket Server/Client: [Socket.io Docs](https://socket.io/docs/v4/)

    - Hosting Provider: [Render Docs](https://render.com/docs)

- **AI Tools Used:** Gemini

- **Repo / Site Link:** 

- **Working Files:**

https://www.youtube.com/watch?v=Bj6lC93JMi0

Blackjack but arguably way worse

Can I make a fun game that also works in real time with multiplayer

- **Short Summary:** An interactive, browser-based multiplayer Blackjack game. Players join tables, place bets, hit, stand, and watch the dealer in real time. The frontend is built with Phaser.io for smooth canvas rendering and animations, backed by a Node.js server using Socket.io to synchronize the game state across all connected clients.

- **Audience / Context:** Casual web gamers and developers looking for a high-quality, real-time multiplayer example. The project serves as both an entertaining game and a showcase of modern full-stack web game development.

### Inquiry Brief

- **Research Question:** What is the most efficient way to synchronize a dynamic game state (card drawing, dealer turns, player busts) between a Node.js server and a Phaser.io client without visual stutter or state desynchronization?

- **Why it Matters:** In real-time card games, any lag or state mismatch breaks the user's immersion and ruins the competitive nature of the game. Solving this teaches robust server-authoritative architecture that applies to more complex multiplayer games.

- **What You Need to Learn:** \* **Phaser.io:** Handling scenes, loading external card assets, and animating card flips based on incoming server events.

    - **Socket.io:** Managing rooms (game tables), emitting events, and resolving race conditions when multiple players act.

    - **Node.js:** Managing server-authoritative game state (e.g., preventing client-side deck tampering).

    - **Render:** Deploying long-lived WebSocket connections efficiently on cloud infrastructure.

- **2–3 Possible Final Outcomes:**

    - A fully deployed, multiplayer-capable web application on Render with working chat and card animations.

    - An open-source boilerplate repository for real-time card games using the Phaser/Socket.io stack.

### Source Starter List

Source 1

- **Title:** Node.js API Documentation

- **Creator:** Node.js Contributors

- **Link:** [Node.js Docs](https://nodejs.org/docs/latest/api/)

- **Type:** Documentation

- **Why it Might Matter:** This serves as the reference for building the core game loop on the backend, handling file serving, and structuring the server application safely.

Source 2

- **Title:** Phaser 3 API Documentation

- **Creator:** Phaser.io Team

- **Link:** [Phaser Docs](https://docs.phaser.io/?_gl=1*1j3bav3*_ga*MjAzODI0MjAzMC4xNzc3NDg5ODg0*_ga_7NC8GZ639E*czE3Nzc0ODk4ODMkbzEkZzEkdDE3Nzc0OTAxMDAkajYwJGwwJGgxMDk2NjkxNzk1)

- **Type:** Documentation

- **Why it Might Matter:** Essential for rendering cards, manipulating UI text, controlling camera perspectives, and handling the core visual components of the frontend game client.

Source 3

- **Title:** Socket.io V4 Documentation

- **Creator:** Guillermo Rauch & Contributors

- **Link:** [Socket.io Docs](https://socket.io/docs/v4/)

- **Type:** Documentation

- **Why it Might Matter:** The backbone of client-server communication. It provides guidance on managing table-specific rooms, player reconnections, and broadcasting card deal events to everyone at the table.

###

# Road Map

### Project Brief / Weekly Roadmap (Weeks 5–11)

Week 5

- **Goal:** Project Scaffolding & Initial Local Setup

- **Activities:** Initialize the Git repository, configure the Node.js backend using Express, and install Phaser.io and Socket.io. Set up a basic static server to serve a simple visual Phaser canvas.

- **Tools:** Node.js, Express, VS Code, Git.

- **Output:** Working local development server hosting a basic Phaser "Hello World" scene.

- **Success Indicator:** Accessing `localhost:3000` loads a blue canvas with a static asset displayed.

Week 6

- **Goal:** Backend Game Logic Core

- **Activities:** Write the foundational server-side JavaScript logic for the deck of cards (shuffling, drawing, value scoring). Build functions for player hands and the dealer's hand.

- **Tools:** Node.js, JavaScript, Jest (optional for testing).

- **Output:** Server-side modules capable of dealing two cards, calculating correct Blackjack totals (handling Aces), and executing dealer hit rules (Hit on soft 17).

- **Success Indicator:** Terminal-based tests accurately log drawn hands and resolve scores without bugs.

Week 7

- **Goal:** Socket.io Integration

- **Activities:** Connect the server game state with client actions over WebSockets. Establish client connections, game initialization events (`game:start`), player moves (`player:hit`, `player:stand`), and dealer response events.

- **Tools:** Node.js, Socket.io, Phaser.

- **Output:** A real-time connection where clicking simple UI buttons in Phaser triggers changes in the backend game state.

- **Success Indicator:** Opening two local browser tabs shows both tabs receiving identical deck draw logs from the server.

Week 8

- **Goal:** Visual Asset Integration & UI Layout

- **Activities:** Import card sprite sheets into Phaser. Build the table layout, player seats, dealer zone, and betting UI. Add simple tweens to animate cards moving from the deck to the player's hand.

- **Tools:** Phaser.io, Photoshop/Aseprite (or free card assets).

- **Output:** A visually distinct digital Blackjack table displaying cards rather than raw text.

- **Success Indicator:** Cards smoothly glide across the screen when drawn, showing correct suits and ranks.

Week 9

- **Goal:** Gameplay Polish & State Syncing

- **Activities:** Handle turn timers, betting limits, game over screens, and visual indicators for who is currently acting. Add a reset mechanic for consecutive rounds.

- **Tools:** Phaser.io, Socket.io.

- **Output:** A cohesive visual game flow from betting to card distribution, game resolution, and clean-up.

- **Success Indicator:** Multiple rounds of Blackjack can be played consecutively without manually reloading the browser.

Week 10

- **Goal:** Hosting & Deployment

- **Activities:** Create a Production build of the client assets. Set up a deployment pipeline on Render using a `render.yaml` configuration file for the Node backend. Configure environment variables for ports and CORS.

- **Tools:** Render, Git/GitHub.

- **Output:** A live URL pointing to the deployed multiplayer web game.

- **Success Indicator:** Sending the live URL to an external device allows real-time multiplayer play across different networks.

Week 11 (Final)

- **Goal:** Final Testing, Bug Squashing, and Polish

- **Activities:** Stress-test concurrent connections. Resolve disconnection edge cases (e.g., player drops mid-hand). Add sound effects and optimize asset loading times.

- **Tools:** Browser DevTools, Chrome Performance tools.

- **Output:** A fully stable, high-performance browser Blackjack game.

- **Success Indicator:** A seamless experience with zero visual desynchronizations and quick initial load times.

# Research Map

## Socket Docs

Source 3

[Introduction | Socket.IO](https://socket.io/docs/v4/)

If you are new to Socket.IO, we recommend checking out our tutorial.

Table element string placeholder

![Image from Landon Umland](https://app.milanote.com/media/p/images/1WkOgM1euSOu97/Keo/image.png?w=800)

## Phaser Docs

Source 2

[docs.phaser.io](https://docs.phaser.io/)

Table element string placeholder

![Image from Landon Umland](https://app.milanote.com/media/p/images/1Wp2C41uSgOcak/eBy/Screenshot%202026-05-18%20at%2011.22.43%E2%80%AFAM.png?w=800)

## Node Docs

Interaction 5

[Index | Node.js v25.9.0 Documentation](https://nodejs.org/docs/latest/api/)

Table element string placeholder

![Image from Landon Umland](https://app.milanote.com/media/p/images/1Wu7xQ1EcRyz7l/rfy/Screenshot%202026-06-01%20at%2011.39.23%E2%80%AFAM.png?w=800)

Table element string placeholder

![Image from Landon Umland](https://app.milanote.com/media/p/images/1Wu84c1EcRyz7q/yS5/image.png?w=800)

## Render Docs

Interactions 6

[Docs + Quickstarts | Render](https://render.com/docs)

Run your code in just a few clicks with Render. You decide what's possible, and we'll help bring it to life.

![Image from Landon Umland](https://app.milanote.com/media/p/images/1Wu6ft1EcRyz7d/yjQ/Screenshot%202026-06-01%20at%2010.16.19%E2%80%AFAM.png?w=800)

Table element string placeholder

![Image from Landon Umland](https://app.milanote.com/media/p/images/1Wu6IC1EcRyz7i/lBa/Screenshot%202026-06-01%20at%2010.46.17%E2%80%AFAM.png?w=800)

## null

Source 5



Table element string placeholder

Source 6

## null

Source 7

## null

Source 8

## null

[Render_Architecture_Blueprint.pdf](https://media.milanote.com/p/files/1Wu6UV1EcRyz7j/zcb/Render_Architecture_Blueprint.pdf) (12.2 MB)

- **Web and Networking:** Builds web servers and handles various network protocols (HTTP, TCP, UDP) as well as DNS resolutions.

- **Data Management:** Efficiently processes large data via streams, interacts with local file systems, handles data compression, and supports local SQLite databases.

- **System Performance:** Supports concurrent task execution through worker threads and clustering, interacts with the operating system, and provides performance monitoring tools.

- **Development and Testing:** Equips developers with built-in debugging consoles, native testing frameworks, and an interactive REPL environment for quick code execution.

- **Security and Extensibility:** Offers built-in cryptographic tools, integrates with C++ for high-performance tasks, and allows applications to be bundled into single, standalone executables.

# ASSETS

![Image from Landon Umland](https://app.milanote.com/media/p/images/1WkIIf10p3UZeY/Wkp/playingCards.png?w=800)

![Image from Landon Umland](https://app.milanote.com/media/p/images/1WkIIf10p3UZf0/vEp/playingCardBacks.png)

[playingCards.xml](https://media.milanote.com/p/files/1WkIIf10p3UZeZ/1d8/playingCards.xml) (4 KB)

[playingCardBacks.xml](https://media.milanote.com/p/files/1WkIIf10p3UZf1/8Z1/playingCardBacks.xml) (1 KB)

[Deck-20260506-122322.piskel](https://media.milanote.com/p/files/1WkHQl10p2pb9c/yXp/Deck-20260506-122322.piskel) (35 KB)

# WK 6 Progress

I am definitely behind on my study plan, because I am behind on damn near everything life is tumultuous right now and I am currently floating in a life raft that was popped 5 weeks ago.

I worked on getting a single player version of blackjack running and getting the server to talk to one client. It correctly functions at minimum level, but currently lacks functions like betting, doubling down, insurance, etc.

I learned the basics of Socket.io so I have a surface level understanding of how the game talks with the server and how the server handles connections.

Everything is going smoothly but I feel like I am behind on my total understanding of how the game code works, and I need to look into each step and make sure I understand the code I have written.

My biggest obstacle is how I am gonna implement my designs into the game, and how the animations are gonna work. I know I should get the core gaming working, but I wanna make sure I see my vision be created and not just the bare minimum.

Goals for next week:

- Add multiplayer

- Delve into code and make sure I can understand it. 

- Don't fall behind (likely)

![Snippet of server code](https://app.milanote.com/media/p/images/1Wmfiw1oOLh21W/dpS/Screenshot%25202026-05-10%2520181832-8mLiX.png?w=800)

Week 7

- **Goal:** Socket.io Integration

- **Activities:** Connect the server game state with client actions over WebSockets. Establish client connections, game initialization events (`game:start`), player moves (`player:hit`, `player:stand`), and dealer response events.

- **Tools:** Node.js, Socket.io, Phaser.

- **Output:** A real-time connection where clicking simple UI buttons in Phaser triggers changes in the backend game state.

- **Success Indicator:** Opening two local browser tabs shows both tabs receiving identical deck draw logs from the server.



In my plan I believe that I dipped a little into week 7, but there is a some overlap between the two so I didn't even notice.

Using notebook LM should hopefully make staying on top of studying and notes more manageable for my monkey brain because I am scatterbrained in all classes except Meg's because the only thing that keeps me on task is the deep anxiety of disappointing my group members and sinking their rafts too.

# Week 7

## What I worked on

I didn't get to much this week, for personal reasons. I did a bit of bug fixing but nothing too major.

I am decently behind in more than one area. I have only done one more study, and have not applied any of it. I am going to try to focus on at least getting the main project part done and then go from there.

I am deviating by focusing on getting the main part of the game finished and the back end stuff working and then going back and making sure I understand the code. I am hoping this will break my brain less and let me make more progress.

![Image from Landon Umland](https://app.milanote.com/media/p/images/1Wp2SC16I57A2I/AS9/Screenshot%202026-05-18%20at%2011.39.10%E2%80%AFAM.png?w=800)

## Reflection part thing

I learned a bit about Phaser and how it works, but nothing super in depth and useful for coding. Just enough to be able to know it when I see it.

In theory everything is going well minus the outside issues causing hiccups. I am struggling to manage my time in a good manner to make progress.

My biggest obstacles are gonna be trying to keep up with not only this class but my others too.

## Next Steps

I just want to get at least a bit of work done each day. Rather than try to get a ton done at once I need to make it more manageable for myself.

# Week 8 Progress

- What did you work on this week (in line with your Week 6-11 plan)?

- Include relevant artifacts (screenshots, prototypes, iterations, readings)

On-Track Check-In

Are you on schedule with your study plan?

- **If yes:** Briefly describe what is helping you maintain momentum.

- **If no:** Describe what shifted (scope/timeline/technology), and why.

- **If you deviated from your original plan:** Document the deviation, your rationale, and what you've learned.

Weekly Reflection

- What did you learn this week (about tools, design, AI, process)?

- What's working well and what's problematic?

- What are your biggest questions or obstacles moving into next week?

Next Steps

- What are 1-3 specific, actionable goals for next week (Week 7) aligned with your plan?

Board Organization Note

Confirm your Milanote board remains structured:

- Each week has its own clearly labeled section/column.

- Key components (Progress, On-Track Check, Reflection, Next Steps) are clearly identified.

Absolutely nothing

I am not on schedule I am a mess right now and barely holding it together.

Life is kicking my ass and making it very hard to exist and between school and work I am mentally drained and can barely get out of bed.

I haven't done much learning about AI directly, but I know now after trying to play catchup, that AI doesn't convert PNGs to SVGs very well, so now I need to hand make SVGs that AI had designed, but decided to not make them as SVGs and gave them to me as a PNG instead.

My biggest obstacle right now is myself, hopefully I get enough accomplished between my classes that I pass. I am gonna try to just get stuff done, and hopefully the deadlines closing in make my brain go into "oh god oh fuck" mode and let me grind work enough to pass.

# Week 9

- What did you work on this week (in line with your Week 6-11 plan)?

- Include relevant artifacts (screenshots, prototypes, iterations, readings)

On-Track Check-In

Are you on schedule with your study plan?

- **If yes:** Briefly describe what is helping you maintain momentum.

- **If no:** Describe what shifted (scope/timeline/technology), and why.

- **If you deviated from your original plan:** Document the deviation, your rationale, and what you've learned.

Weekly Reflection

- What did you learn this week (about tools, design, AI, process)?

- What's working well and what's problematic?

- What are your biggest questions or obstacles moving into next week?

Next Steps

- What are 1-3 specific, actionable goals for next week (Week 7) aligned with your plan?

Board Organization Note

Confirm your Milanote board remains structured:

- Each week has its own clearly labeled section/column.

- Key components (Progress, On-Track Check, Reflection, Next Steps) are clearly identified.

Ignored the actual plan and just got down to coding and making sure I have a functional project to present

// ========================================== // 3. MULTIPLAYER SCENE (CORRECTED) // ========================================== class MultiplayerScene extends Phaser.Scene { constructor() { super('MultiplayerScene'); } preload() { this.load.atlasXML('cardDeck', 'assets/playingCards.png', 'assets/playingCards.xml'); this.load.atlasXML('cardBacks', 'assets/playingCardBacks.png', 'assets/playingCardBacks.xml'); } create() { this.socket = socket; this.socket.emit('modeSelection', 'multi'); // Store game state this.currentRoom = null; this.myPlayerId = this.socket.id; this.gameActive = false; this.playerCardSprites = {}; // Track card sprites by player ID this.playerPositionMap = {}; // ✅ Map player ID to their layout position this.gameContainer = null; // Will hold all game scene elements // UI Text Components this.statusText = this.add.text(400, 30, 'MULTIPLAYER LOBBY', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5); this.lobbyInfoText = this.add.text(400, 100, 'Connecting to multiplayer pool...', { fontSize: '16px', fill: '#aaa', align: 'center' }).setOrigin(0.5); // Fixed Ready Button this.readyButton = this.add.text(400, 550, 'TAP TO READY UP', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 12 }) .setOrigin(0.5) .setInteractive() .setVisible(false) .setDepth(10); this.readyButton.on('pointerdown', () => { this.socket.emit('playerReady'); }); // Trigger the room prompt this.time.delayedCall(500, () => { const roomName = prompt("Enter a Room Name to create or join (e.g., Room1):"); if (roomName) { this.currentRoom = roomName; this.socket.emit('joinRoom', roomName); } else { this.scene.start('MainMenuScene'); } }); // --- NETWORK EVENT LISTENERS --- this.socket.on('roomUpdate', (data) => { this.readyButton.setVisible(true); let playerListString = \`Room: ${data.roomName}\\n\\nConnected Players (${data.players.length}/4):\\n\`; data.players.forEach((player, index) => { const isMe = player.id === this.socket.id ? " (You)" : ""; const readyStatus = player.isReady ? "✅ READY" : "⏳ Waiting..."; playerListString += \`${index + 1}. ID: ${player.id.substring(0, 5)}...${isMe} ── ${readyStatus}\\n\`; }); this.lobbyInfoText.setText(playerListString); }); this.socket.on('multiGameState', (data) => { this.gameActive = true; this.statusText.setText('MULTIPLAYER GAME!'); this.statusText.setFill('#0f0'); this.lobbyInfoText.setVisible(false); this.readyButton.setVisible(false); // Create container for game scene if (this.gameContainer) { this.gameContainer.destroy(); } this.gameContainer = this.add.container(0, 0); // ✅ RENDER DEALER CARDS AT TOP const dealerLabel = this.add.text(400, 20, 'DEALER', { fontSize: '20px', fill: '#ff6b6b', fontStyle: 'bold' }); dealerLabel.setOrigin(0.5); this.gameContainer.add(dealerLabel); // Show dealer cards const dealerCardX = 320; data.dealerHand.forEach((card, idx) => { const sprite = this.add.image( dealerCardX + (idx \* 90), 80, 'cardDeck', \`card${card.suit}${card.value}.png\` ).setScale(0.8); this.gameContainer.add(sprite); }); // ✅ IMPROVED LAYOUT: Better spacing to prevent overlap // 2 players side-by-side on top, 2 on bottom const playerLayout = \[ { x: 120, y: 220, label: 'Player 1' }, { x: 680, y: 220, label: 'Player 2' }, { x: 120, y: 420, label: 'Player 3' }, { x: 680, y: 420, label: 'Player 4' } \]; // Initialize card sprite tracking and position mapping for each player data.players.forEach((player, playerIdx) => { this.playerCardSprites\[player.id\] = \[\]; this.playerPositionMap\[player.id\] = playerLayout\[playerIdx\]; // ✅ Store position mapping const pos = playerLayout\[playerIdx\]; const isYou = player.id === this.socket.id ? " (YOU)" : ""; const playerColor = player.id === this.socket.id ? '#00ff00' : '#aaaaaa'; // Player label const label = this.add.text(pos.x, pos.y - 40, pos.label + isYou, { fontSize: '14px', fill: playerColor, fontStyle: 'bold' }); label.setOrigin(0.5); this.gameContainer.add(label); // Draw initial cards player.hand.forEach((card, cardIdx) => { const cardSprite = this.add.image( pos.x + (cardIdx \* 60), pos.y, 'cardDeck', \`card${card.suit}${card.value}.png\` ).setScale(0.7); this.gameContainer.add(cardSprite); this.playerCardSprites\[player.id\].push(cardSprite); }); // Player score const scoreText = this.add.text(pos.x, pos.y + 80, \`Score: ${player.score}\`, { fontSize: '16px', fill: '#fff', fontStyle: 'bold' }); scoreText.setOrigin(0.5); scoreText.setName(\`score\_${player.id}\`); // Tag for easy updates this.gameContainer.add(scoreText); }); // ✅ ADD HIT/STAY BUTTONS FOR CURRENT PLAYER this.hitButton = this.add.text(300, 550, 'HIT', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 }) .setOrigin(0.5) .setInteractive() .setDepth(10); this.stayButton = this.add.text(500, 550, 'STAY', { fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: 10 }) .setOrigin(0.5) .setInteractive() .setDepth(10); this.hitButton.on('pointerdown', () => { if (this.gameActive) { this.socket.emit('playerHit'); } }); this.stayButton.on('pointerdown', () => { if (this.gameActive) { this.socket.emit('playerStay'); this.hitButton.setVisible(false); this.stayButton.setVisible(false); } }); console.log("Multiplayer Match Initialized:", data); }); // ✅ IMPROVED: Handle player updates with animated card drawing this.socket.on('playerUpdate', (data) => { console.log(\`Player ${data.playerId} updated:\`, data); // Update score text const scoreText = this.gameContainer.getByName(\`score\_${data.playerId}\`); if (scoreText && data.score !== undefined) { scoreText.setText(\`Score: ${data.score}\`); // Flash the score if it's a bust if (data.status === 'busted') { scoreText.setFill('#ff0000'); } } // If new cards were drawn, add them to the display if (data.hand) { // ✅ USE THE POSITION MAPPING instead of trying to calculate it const pos = this.playerPositionMap\[data.playerId\]; if (!pos) { console.warn(\`No position found for player ${data.playerId}\`); return; } // Destroy old card sprites if (this.playerCardSprites\[data.playerId\]) { this.playerCardSprites\[data.playerId\].forEach(sprite => sprite.destroy()); this.playerCardSprites\[data.playerId\] = \[\]; } // Draw updated cards with a slight animation data.hand.forEach((card, cardIdx) => { const cardSprite = this.add.image( pos.x + (cardIdx \* 60), pos.y, 'cardDeck', \`card${card.suit}${card.value}.png\` ).setScale(0.7); // Animate new card appearing this.tweens.add({ targets: cardSprite, scale: { from: 0.3, to: 0.7 }, duration: 300, ease: 'Back.out' }); this.gameContainer.add(cardSprite); this.playerCardSprites\[data.playerId\].push(cardSprite); }); } }); // ✅ IMPROVED: Return to lobby after game instead of main menu this.socket.on('gameResults', (data) => { this.gameActive = false; this.hitButton.setVisible(false); this.stayButton.setVisible(false); // Show results screen const resultsBg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8); resultsBg.setDepth(100); const resultsTitle = this.add.text(400, 100, 'ROUND OVER!', { fontSize: '48px', fill: '#ffff00', fontStyle: 'bold' }); resultsTitle.setOrigin(0.5).setDepth(101); const dealerCardsStr = data.dealerHand.map(c => \`${c.value}${c.suit\[0\]}\`).join(', '); let resultsStr = \`DEALER: ${dealerCardsStr}\\n\\n\`; data.results.forEach((result, idx) => { const status = result.result === 'Won!' ? '✅' : result.result === 'Push!' ? '➖' : '❌'; resultsStr += \`Player ${idx + 1}: ${status} ${result.result}\\n\`; }); const resultsText = this.add.text(400, 250, resultsStr, { fontSize: '18px', fill: '#fff', align: 'center', lineSpacing: 10 }); resultsText.setOrigin(0.5).setDepth(101); // Play Again Button const playAgainBtn = this.add.text(400, 480, 'READY FOR NEXT ROUND?', { fontSize: '20px', fill: '#fff', backgroundColor: '#0f0', padding: 15, align: 'center' }).setOrigin(0.5).setInteractive().setDepth(101); playAgainBtn.on('pointerdown', () => { // Destroy results screen resultsBg.destroy(); resultsTitle.destroy(); resultsText.destroy(); playAgainBtn.destroy(); // Return to lobby this.returnToLobby(); }); // Back to Menu Button const menuBtn = this.add.text(400, 530, 'BACK TO MENU', { fontSize: '16px', fill: '#aaa', backgroundColor: '#333', padding: 10, align: 'center' }).setOrigin(0.5).setInteractive().setDepth(101); menuBtn.on('pointerdown', () => { this.socket.emit('leaveRoom'); this.scene.start('MainMenuScene'); }); }); this.socket.on('roomError', (errorMessage) => { alert(errorMessage); this.scene.start('MainMenuScene'); }); // --- LIFECYCLE CLEANUP --- this.events.on('shutdown', () => { this.socket.off('roomUpdate'); this.socket.off('roomError'); this.socket.off('multiGameState'); this.socket.off('playerUpdate'); this.socket.off('gameResults'); }); } // ✅ NEW: Return to lobby after a round returnToLobby() { this.gameActive = false; // Destroy game container if (this.gameContainer) { this.gameContainer.destroy(); } // Hide game buttons if (this.hitButton) this.hitButton.setVisible(false); if (this.stayButton) this.stayButton.setVisible(false); // Reset state this.statusText.setText('MULTIPLAYER LOBBY'); this.statusText.setFill('#fff'); this.lobbyInfoText.setVisible(true); this.readyButton.setVisible(true); // Request updated room state from server this.socket.emit('getRoomStatus', this.currentRoom); } }

[Multiplayer Blackjack](https://blackjack-online-2zlx.onrender.com)

![Image from Landon Umland](https://app.milanote.com/media/p/images/1Wxb2f1we6p8ao/N5q/image.png)

I feel like I am so off of my study plan that it never existed in the first place.

 I got super off track and I would be more ashamed if I was too stressed and burnt out already. 

My goal now is to just cram as much as I can to make the best product while desperately trying to pass.

I have hit my Claude limits 3 times already. I now know its limits. This is a lot more of a process than I thought going into this. A lot of trouble shooting when things go wrong. 

I am making good progress but I am out of time, but I would like to keep working on this as a personal project after class. 

My biggest question is why oh why did I let myself get this far behind

My goals are to avoid this next year and to apply for accommodation so I have a bit more leeway.

## Something

Coded mainly in Gemini since thats where my Gem is, and used Claude Sonnet to debug and check for errors to correct

## Coding May 6th

Today, we successfully transitioned a buggy, fragile Blackjack prototype into a robust, professional-grade multiplayer-ready application. We focused on structural integrity, state management, and refined user experience.

---

### 🛠 Improvements & Bug Fixes

1\. Robust State Management

- **The Problem:** The game was reading the player's score by parsing UI text strings (e.g., splitting "Score: 21"). This was fragile and prone to crashing if the text format changed.

- **The Fix:** Implemented `this.playerScore` as a dedicated numeric variable in the game state. The UI now reflects the data, but the logic relies strictly on the underlying numbers.

2\. Structural Integrity (Socket Logic)

- **The Problem:** "Listener Stacking." Every time a card was dealt, a new socket listener was being created inside another, leading to exponential card dealing and memory leaks.

- **The Fix:** Flattened the socket architecture. All listeners (`gameState`, `receiveCard`, `dealerTurn`) are now defined once at the top level, ensuring clean and predictable communication.

3\. "Natural 21" (Blackjack) Logic

- **The Problem:** If a player was dealt 21 immediately, the game would hang because the buttons were hidden, but the dealer's hand was never revealed.

- **The Fix:** \* **Server-Side:** The server now detects a Blackjack on the deal and immediately calculates the dealer's full turn.

    - **Client-Side:** The client recognizes the `isBlackjack` flag and reveals the dealer's full hand instantly, bypassing the "hidden card" stage.

4\. User Experience (UX) Polish

- **Auto-Stay:** Added logic to automatically trigger a "Stay" event once a player hits exactly 21, creating a smoother gameplay flow.

- **UI Cleanup:** Fixed "ghost buttons" by ensuring Hit and Stay buttons are explicitly hidden during Blackjack reveals or busts.

- **Memory Management:** Implemented proper cleanup for temporary text objects (like the "BLACKJACK!" banner) to prevent them from layering over subsequent rounds.

---

### 🏗 Updated Architecture

**Server Side (**`server.js`**)**

- **Per-Player Scoping:** Moved `gameDeck` and player hands inside the `connection` block. This prevents players from interfering with each other's decks.

- **Deck Safety:** Added guards to reshuffle the deck mid-hand if it ever runs empty during a dealer's hit streak.

- **Game Guards:** Re-implemented the `gameInProgress` flag to prevent out-of-order socket requests.

**Client Side (**`public/game.js`**)**

- **Texture Reliability:** Fixed the Atlas loading logic to correctly pull from `cardDeck` for face cards and `cardBacks` for the dealer's hidden card.

- **Event Cleaning:** Added `socket.off()` calls before defining new listeners to ensure the client environment remains clean during reloads or scene restarts.

---

### ✅ Final Status: **Stable**

The game now correctly handles:

1. Starting a new game with a fresh deck.

2. Hitting and staying with proper score calculation.

3. Automatic dealer resolution.

4. Instant win conditions (Blackjack) with full dealer reveal.

5. Clean reset for consecutive rounds.

## Something2

- **Prompt Log**

    - Entry 1

        - Prompt used

        - Model / tool

        - Output summary

        - What changed afterward

    - Entry 2

        - Prompt used

        - Model / tool

        - Output summary

        - What changed afterward

- **Experiment Log**

    - Experiment 1

        - What you tried

        - Screenshots / notes

        - What worked

        - What failed

        - Next step

    - Experiment 2

        - What you tried

        - Screenshots / notes

        - What worked

        - What failed

        - Next step

**Possible Final Direction(s):** \* A single-player vs. dealer mode with rich visual animations.

- A fully networked multiplayer casino table where multiple users interact simultaneously.