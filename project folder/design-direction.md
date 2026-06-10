# Design Direction

## Project Mood
*   **Classic Cheesy Casino meets Modern Minimalism:** The nostalgia of a vintage, neon-and-felt casino table, stripped of overwhelming 90s clutter and presented through a clean, sharp, modern web lens.
*   **The "Balatro" Effect:** Subtle hypnotic or kinetic undertones. While the layout remains minimal, UI elements might feature slight retro CRT warps, glowing gold hovers, or smooth card-shuffling motion cues to bring it to life.

## Visual Keywords
*   Vintage Vegas
*   High-contrast Minimal
*   Tactile Felt
*   Chimerical / Kinetic (Balatro-inspired)
*   Sleek Retro

## Color Direction
*   **Primary (The Table):** Deep, rich Casino Green (`#0B6623` or a darker, desaturated forest green to keep it minimal).
*   **Secondary (The Suite):** Dark Velvet Red (`#8B0000` or a deep crimson) used for high-impact accents, primary buttons, or alert states.
*   **Highlights:** Matte Gold / Warm Brass (`#D4AF37`) used sparingly for borders, active states, and crisp typography highlights.
*   **Background / Canvas:** Deep charcoal or near-black (`#121212`) to allow the casino colors to pop without making the screen look like a bright green blob.

## Typography Direction
*   **Custom Implementation:** A specific user-provided typeface will drive the entire project identity.
*   **Fallback & Hierarchy:** System-level geometric sans-serifs (like Inter or Roboto) for small, technical documentation text, allowing the custom typeface to command full attention on headings, scores, and UI callouts.

## Layout Direction
*   **Clean Web Dashboard:** The website acts as a sleek, centralized hub for your project and research rather than an overwhelming arcade page. 
*   **Focused CTA:** A prominent, beautifully styled link/button to launch the actual game canvas.
*   **Scannable Sections:** Clear, minimal zones dedicated to technical research, documentation links, and project architecture notes.

## Image / Media Direction
*   **Sleek Vector / Flat Art:** Minimalist, clean card vectors or poker chip iconography using the strict green/red/gold palette.
*   **Atmospheric Shaders:** If using Phaser for visual elements on the landing page, utilize lightweight WebGL fragment shaders to create a subtle, floating smoke or slow-moving neon glow effect in the background, mirroring *Balatro’s* screen-juice.

## References
*   *Balatro* (For its hypnotic, psychedelic spin on classic card games, screen shake, and floating UI).
*   Classic retro casino UI and physical blackjack tables.

## Avoid
*   Bright, saturated neon cyber-purples or blues (keep it strictly red/green/gold).
*   Overly complex, bloated layouts or intrusive pop-ups.
*   Generic, flat Bootstrap-style buttons.

## Notes for the Coding Agent
*   **Phaser.io Optimization:** When setting up the game link or mini-preview, ensure the Phaser configuration (`Phaser.Types.Core.GameConfig`) utilizes `parent` targeting correctly so it scales nicely within responsive CSS Grid or Flexbox wrappers without breaking the minimal site layout. Use `mode: Phaser.Scale.FIT` for clean scaling.
*   **Socket.io State Integration:** Design the web UI to easily accommodate real-time state displays (e.g., "Players Online", "Active Tables") fetched via Socket.io events before the user clicks through to the game.
*   **Render / Railway Deployment:** Keep asset sizes optimized. Use compressed WebP formats for any background textures (like a felt pattern) to ensure lightning-fast loading speeds on cloud hosting platforms.
*   **CSS Theme:** CSS variables should be strictly mapped to the approved palette:
```css
    :root {
      --casino-green: #0a4d22;
      --velvet-red: #7a0010;
      --gold-highlight: #e5b842;
      --dark-bg: #141414;
    }
    ```