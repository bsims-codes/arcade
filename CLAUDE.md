Goal
- Create a single-page site that shows an 800×600 “room” view using a background image: `arcade-background.jpg`.
- Place several clickable arcade machines (hotspots) on top of the background.
- Clicking a machine opens a modal overlay (lightbox) containing the selected minigame embedded via iframe (NOT navigating away).
- Minigame URLs to embed:
  1) https://bsims-codes.github.io/myvmk-bubbles/
  2) https://bsims-codes.github.io/TinksHex/
  3) https://bsims-codes.github.io/the-swan/
  4) https://bsims-codes.github.io/cup-shuffle/

Constraints / Requirements
- No frameworks. Plain HTML/CSS/JS only.
- Fixed logical stage size: 800×600. No scaling; background fits exactly 800×600.
- The arcade “machines” should be defined as a data structure (array of objects) with:
  - id, label, url
  - x, y, width, height (hotspot rectangle)
  - optional: hoverTooltip text
- UI behavior:
  - Hover on a machine highlights it (subtle outline + glow) and shows a small tooltip label.
  - Click opens a modal overlay centered on screen:
    - Modal container size: 860×660 (or similar) with padding and a title bar.
    - Inside modal: iframe sized 800×600 pointing at the game URL.
    - Close button (X), ESC closes, clicking outside closes.
  - When modal opens: disable background scrolling, trap focus, and ensure keyboard input goes to the iframe (click iframe on open).
  - Show a loading indicator until iframe “load” event fires.
- Provide a fallback “Open in new tab” link inside the modal in case a game cannot be iframed.
- Add a small footer text: “VMK Arcade Demo – click a machine to play.”

Important: Iframes may fail if the game site sets X-Frame-Options or CSP frame-ancestors restrictions. You must:
- Implement and display a clear inline error state if iframe fails to load within 5 seconds:
  - Show message: “This game can’t be embedded. Open in a new tab.”
  - Show the external link.
- Do NOT change the existing minigame repos unless embedding is blocked. First try the iframe approach.

Repository approach
- Create a NEW repo (or new folder) for this “arcade room” site only. Do not merge code from the minigames.
- The arcade room site is just a launcher; it links to the other sites via iframes.
- Keep files minimal: `index.html`, `styles.css`, `script.js`, and `arcade-background.jpg`.

Implementation steps you must follow
1) Before coding, analyze whether embedding these GitHub Pages sites is likely to work (note: you cannot actually test network in this environment, so reason from typical GitHub Pages defaults and implement robust fallback).
2) Draft a short plan with file structure and key components.
3) Implement:
   - index.html with stage container and modal markup
   - styles.css for stage layout, hotspot highlighting, tooltip, modal overlay, close button, loading state
   - script.js to:
     - render hotspots from a config array
     - handle hover tooltip
     - open/close modal
     - set iframe src
     - handle “load” and timeout failure fallback
     - keyboard ESC and focus handling
4) Provide clear instructions to run locally and deploy on GitHub Pages.

Hotspot placement
- Since we don’t know exact machine positions on the image, implement a “debug placement mode”:
  - Press `P` to toggle showing hotspot rectangles + coordinates overlay.
  - Provide an easy way to tweak hotspot x/y/w/h in the config.
- Create placeholder hotspot coordinates that are reasonable defaults, and add comments: “Adjust these to match your image.”

Deliverables
- Provide the full code for index.html, styles.css, script.js.
- Include the `machines` config array with the 4 games.
- Include brief deployment instructions for GitHub Pages.

Do NOT overengineer. Keep it clean, stable, and demo-ready.