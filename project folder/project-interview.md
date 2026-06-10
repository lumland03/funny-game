# Project Interview Notes

## Project Title
Multiplayer Blackjack Game with Frontend-Backend Integration

## One-Sentence Project Summary
I built a playable multiplayer blackjack game using AI-assisted code generation to understand how frontend and backend frameworks interact and communicate in real time.

---

## Starting Point
I wanted to explore backend web development and chose blackjack as the medium because it's simple enough to finish but complex enough to be interesting. The game loop is fun and the rules are straightforward, which meant I could focus on the technical architecture rather than game design complexity.

## Inquiry Question
**What are the interactions between front and backend frameworks, and how do I write and navigate them?**

This was my core question throughout the project. I wasn't asking about a specific framework or language—I was asking about the *relationship* between client-side and server-side code.

## Why This Question Mattered
I find coding really fun, but I realized I had a gap in my understanding. Most of the code I'd written before was isolated—either frontend or backend, but not both talking to each other. I wanted to understand how real, interconnected web systems actually work. This question felt like the bridge between "knowing how to code" and "understanding why web development is complex."

---

## Research and Sources
I didn't do traditional research (reading articles, watching tutorials, etc.). Instead, I used AI as my primary resource:
- **Claude** (main coding partner)
- **Gemini** (initial coding, verification)

I started by asking AI to explain code after writing it, taking notes as I went. When I ran out of time, I shifted to using multiple AI models to verify and correct each other's work.

## What I Found
Through building the game, I discovered that **frontend-backend complexity increases dramatically with multiplayer**. In singleplayer, everything happens on one client—the game state is simple and local. But in multiplayer:
- The backend has to manage different players doing different things simultaneously
- Everyone needs real-time updates
- The system has to stay in sync without breaking
- Turn management, lobby creation, and state persistence all live on the server

I also realized that **JavaScript is vastly more complex than HTML and CSS combined**. My final codebase is roughly 98% JavaScript and 2% HTML/CSS. The logic is where the complexity lives, not the markup.

## Source Verification
I verified code correctness through **active play testing**. I tested the game numerous times, reported bugs and issues back to Claude and Gemini, and watched them iterate. When I wasn't specific enough in my bug reports, the AIs asked clarifying questions, and I learned to use console errors to describe problems more precisely.

I cross-checked Claude and Gemini outputs when they disagreed, assuming they'd be objective and improve on each other's code. This mostly worked, though both tools still introduced bugs. The iterative back-and-forth gradually improved the code, even though it wasn't a linear path.

## How Research Shaped the Project
My learning-focused approach shaped the first phase significantly. By asking AI to explain code, I built a basic mental model of how the game loop works. But time pressure forced me to pivot away from deep learning and toward efficiency—getting the project done.

This pivot taught me that **understanding and shipping are different goals**. I shipped a working multiplayer game, but I don't have fluency in the code that powers it. That's a real tradeoff I made consciously.

---

## Research Dashboard / Approach and Engagement

**Phase 1: Learning-Focused (Early)**
- Approach: Ask AI to write code, then explain it back to me
- Engagement: Note-taking, reading explanations, trying to understand before moving forward
- Outcome: Built basic mental model, but slow progress

**Phase 2: Efficiency-Focused (After Time Crunch)**
- Approach: Use Claude and Gemini to verify each other; report bugs from testing
- Engagement: Active play testing, bug reporting, iteration cycles
- Outcome: Faster code generation, but less personal understanding

**Phase 3: Polish (Final)**
- Approach: Styling and formatting adjustments
- Engagement: Color changes, coordinate tweaks, typography
- Outcome: Functional and visually coherent game

## AI Tools and Prompt Experiments

**Primary Tools:**
- Claude (final main coder)
- Gemini (initial coding, cross-verification)

**Key Prompts (Paraphrased):**
- "Write me a multiplayer blackjack game with a backend and frontend"
- "Can you explain how this code works?"
- "I'm getting this error [console error]. How do I fix it?"
- "Hey I need to add a dealer animation so you see the dealer drawing the cards after instead of just calculating it all at once"

**Prompt Evolution:**
Early prompts were vague ("explain this"). Over time, I got more specific, especially when reporting bugs. I learned to include console errors, reproduction steps, and context about what I expected vs. what happened.

**Model Switching:**
I moved from Gemini to Claude because Claude caught more errors when I pasted code to verify it. I trusted the cross-verification approach—assuming AIs would be objective about each other's code. They were mostly helpful, though both still made mistakes.

---

## Process Page / Workflow and Pivots

**Original Scope:**
Heavily stylized game with animations, betting, insurance, and intricate visual design.

**Actual Scope (After Constraints):**
Core playable game: singleplayer and multiplayer modes, basic UI, functional dealer logic.

**Why the Pivot:**
Personal circumstances outside the project ate up time. I had to choose between polish and completion. I chose to ship something working.

**Strategic Decision: Singleplayer First**
I built singleplayer as a testing ground before tackling multiplayer. This wasn't accidental—it was deliberate. Singleplayer let me test game state and core functionality without the added complexity of backend frameworks and networking. Once that worked, I had a jumping-off point for multiplayer (though multiplayer required significantly more code).

**Key Iterations:**
1. **Game Logic** → Dealer rules, turn management, scoring
2. **Singleplayer Flow** → Start, hit, stay, results
3. **Multiplayer Lobby** → Room creation, player joining, ready-up system
4. **Turn Management** → Ensuring players take turns in order
5. **Dealer Animation** → Discovered through play testing that results felt too instant; added delay and "Dealer Drawing..." message

**Bugs and Fixes:**
All functionality bugs were handled by Claude and Gemini based on my testing reports. I didn't write functional fixes myself. My role was identifying problems and describing them clearly enough for the AI to solve.

**Time Crunch Moment:**
Ran out of AI credits mid-development while multiplayer had heavy issues. Panicked. Had to wait for credits to replenish while swapping between models to do as much as possible. This forced me to be strategic about which problems I tackled first.

---

## Final Product or Outcome

**What It Does:**
- **Menu Screen:** Players choose single or multiplayer
- **Singleplayer:** Play against the dealer, hit or stay, see results
- **Multiplayer:**
  - Type a lobby name to create or join a room (2-4 players)
  - Ready up when all players are in the lobby
  - Game starts; players take turns in order (first to ready is player 1, etc.)
  - Hit or stay buttons appear only when it's your turn
  - When the last player finishes, there's a 1-2 second delay with "Dealer Drawing..." text
  - Dealer draws to 17+
  - Results screen shows who won, lost, busted, or pushed

**Visual Design:**
- Small card sprites at the bottom of the screen
- Hit and Stay buttons below cards
- Turn indicator so you know when it's your turn
- Color-coded UI (greens, blues, yellows)
- Custom typography

**What Works Best:**
The multiplayer connection and gameplay loop. That's where my relief and joy come from—knowing that something this complex actually works. Multiplayer networking is the hardest part and the most directly tied to my original question about frontend-backend interactions.

**What Didn't Make It:**
- Betting system
- Insurance
- Detailed animations (beyond dealer drawing delay)
- Heavily stylized visual design
- Sound effects

---

## Product Page / Authorship and Synthesis

**What I Wrote:**
- HTML structure (index.html)
- All styling decisions: colors, backgrounds, typography, coordinate adjustments for card and button positioning

**What AI Wrote:**
- All functional JavaScript (game logic, turn management, dealer rules, multiplayer networking)
- All backend code (Node.js, Socket.IO, room management, real-time updates)

**How I Shaped the Result:**
1. **Problem Identification:** I tested constantly and reported bugs, forcing the AI to iterate
2. **Scope Management:** I decided to cut features and build singleplayer first
3. **UX Discovery:** I noticed the instant results felt wrong and pushed for a dealer drawing animation
4. **Communication:** I learned to describe problems clearly, using console errors and reproduction steps
5. **Visual Direction:** All aesthetic choices were mine—colors, layout, typography

**The Real Collaboration:**
Even though I didn't write the functional code, I wasn't passive. I:
- Identified what needed to be built
- Tested it thoroughly
- Reported specific problems
- Iterated on descriptions until the AI understood
- Made strategic decisions about scope and priority
- Owned the visual presentation

**What I Don't Understand Yet:**
The actual code itself. I have a base understanding of how frontend-backend interaction *works* (client sends action, server processes it, sends update back, client displays it). But I couldn't sit down and explain the actual Socket.IO implementation, the room management logic, or the dealer drawing sequence in detail. That's a gap I plan to fill.

---

## What I Learned

**About Coding:**
- JavaScript is vastly more complex than markup languages
- The complexity in web development lives in logic, not structure
- Frontend-backend interaction is hard because you're managing state across two environments
- Multiplayer adds exponential complexity compared to singleplayer

**About Problem-Solving:**
- Describing problems clearly is a skill (console errors + reproduction steps > "it's broken")
- Testing constantly catches issues early
- Strategic scope reduction is better than shipping broken features

**About Working with AI:**
- AI tools can verify each other, but they're not neutral
- Iteration matters more than getting it right the first time
- Explaining what you want takes practice
- Time and credits are real constraints

**About Myself:**
- I love coding, but I don't have fluency yet—and that's okay
- I can manage complexity by breaking it into pieces (singleplayer first)
- I care more about shipping something working than understanding everything
- I want to go back and learn the code deeply, but I understand that takes time

---

## Reflection Notes

**On the Process:**
This project taught me the difference between *building* and *learning*. I came in wanting to understand frontend-backend interactions through deep learning. I left with a working multiplayer game and a surface-level understanding. That's not failure—it's pragmatism. But it's also incomplete.

**On Time and Scope:**
The time crunch forced me to make real engineering decisions: prioritize multiplayer over polish, build singleplayer first, cut features. Those decisions were smart. But they also meant I couldn't afford the learning-focused approach I started with. I got faster, but less deep.

**On AI as a Tool:**
I started thinking AI would be objective and improve code through cross-verification. I learned that AI tools are helpful but imperfect. They're better than nothing, but they're not a substitute for understanding. The best use case I found was iterative: report a problem, AI fixes it, test it, report the next problem.

**On What's Next:**
I want to go back to the code and understand it. Not immediately—I'm okay with shipping something I don't fully understand. But long-term, I want fluency in JavaScript and real understanding of Socket.IO and real-time networking. This project showed me what I need to learn next.

---

## Private Evaluation Notes

**For Canvas Reflection (Not Public):**

**Strengths:**
- Shipped a working multiplayer game under time pressure
- Made smart architectural decisions (singleplayer first, scope reduction)
- Actively tested and iterated
- Learned to work effectively with AI tools despite constraints

**Gaps:**
- Did not achieve the original learning goal (understanding code deeply)
- Surface-level knowledge of Socket.IO and real-time networking
- Didn't write functional code myself
- Styling was the only technical contribution I made

**Grade Reflection:**
For the purposes of passing the class, this is complete. I shipped a working product that demonstrates understanding of frontend-backend interaction (even if I couldn't explain it in detail). The process was honest—I hit constraints, adapted, and delivered.

But if I'm evaluating myself honestly, I got 50% of what I wanted: a working game, but not the deep understanding. That's a real tradeoff.

**What I'd Do Differently:**
- Budget time for learning-focused iteration, not just shipping
- Buy a model subscription from the start to avoid credit crises
- Set clearer boundaries between learning phase and shipping phase
- Document my prompts and AI responses more systematically
- Test earlier and more frequently

---

## Evidence to Include

**Artifacts to Show:**
1. Screenshots of the game UI (menu, singleplayer screen, multiplayer lobby, game in progress, results)
2. Screenshots of prompts and AI responses (especially the dealer animation prompt and iteration)
3. Screenshots of times you ran out of credits (shows real constraint)
4. Console errors you reported (shows problem-solving process)
5. A before/after of styling (shows your visual contributions)
6. Video or GIF of multiplayer gameplay (shows it actually works)

**What NOT to Show (Keep Private):**
- Full code walkthrough (audience doesn't need it, and you don't have fluency to explain it)
- Every bug and fix (too granular; focus on key iterations)
- Personal circumstances (just say "time constraints")
- Unpolished UI iterations (show final state)

---

## Links and Workspace Materials

**Public Links:**
- GitHub repository: [Your repo URL]
- Playable game: [Your hosted URL]

**Private Materials (For Reference):**
- Gemini project file (initial coding and notes)
- Claude conversation history (testing, bugs, dealer animation iteration)
- Local git history (shows iteration process)

**Screenshots to Gather:**
- [ ] Main menu screen
- [ ] Single player gameplay
- [ ] Multiplayer lobby
- [ ] Turn indicator in action
- [ ] Results screen
- [ ] Dealer drawing animation
- [ ] Sample AI prompts
- [ ] Credit depletion screenshot

---

## Notes for Website Builder

This project is strongest when framed as **"I built something real under constraints"** rather than **"I fully understand how it works."** Be honest about:
- Using AI for code generation
- Learning-to-shipping pivot
- Time crunch and adaptation
- What you understand vs. what you're still learning

The story is more interesting than the code. Show the game, show the process, acknowledge the tradeoffs. That's authentic and more compelling than pretending you have fluency you don't have.
