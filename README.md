# FOG SDE Assessment — Interactive Game Portal

A two-module React application built for the FOG SDE Internship Round 1 assessment. The goal was to demonstrate UI engineering depth, game logic implementation, and attention to UX detail.

**Live URL:** https://fog-game-portal.vercel.app ← _update after deploy_
**GitHub:** https://github.com/smitprajapati/fog-game-portal ← _update with your username_
**Candidate:** Smit Prajapati

---

## Modules

### 1. Game Selection Carousel

A horizontal card-based game browser with:

- **Drag & swipe** navigation powered by Framer Motion's `drag` constraint
- **Keyboard accessibility** — Left/Right arrow keys move between cards, Escape dismisses the video
- **Center-scale focus** — active card sits at full opacity/brightness; adjacent cards desaturate to ~42% opacity so the focal point is always obvious
- **Skeleton loaders** on each card while images fetch
- **Cinematic video overlay** — clicking the active card opens a `autoPlay / muted / loop` fullscreen player with a blurred backdrop; clicking outside or pressing Escape closes it
- Framer Motion `layoutId="nav-pill"` spring animation on the nav toggle and `layoutId="active-ring"` on the card selection ring

### 2. Pattern Grid Engine

A playable tile-based game with configurable grid dimensions (min 10×10):

- **Pattern 1 — Diamond:** a centered diamond outline built with Manhattan-distance math. Outline tiles = blue (collect), interior = red (danger), exterior = green (safe)
- **Pattern 2 — Border Cross:** a 2-tile outer border ring (blue) with an alternating cross through the center (red/green)
- **Auto-progression:** collecting all blue tiles in Pattern 1 immediately rebuilds the grid in Pattern 2 without user input
- **Win/Lose overlays** appear when the player clears both patterns (Win), runs out of lives (Lose), or lets the timer expire (Lose)

---

## Game Constraints

| Constraint | Value |
|---|---|
| Starting lives | 5 |
| Round timer | 30 seconds |
| Points per blue tile | +10 |
| Red tile penalty | −1 life + blink animation |
| Green tile | safe to traverse |

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 19 + Vite 8 | Fast HMR, native ESM |
| Styling | Tailwind CSS v3 + PostCSS | Utility-first, custom keyframe animations via `@keyframes` in config |
| Animation | Framer Motion 12 | `layoutId` spring transitions, drag gestures |
| Icons | Inline SVG | Zero extra runtime cost, no context issues |
| State | `useState` + custom `useGameEngine` hook | Keeps components thin; all game logic is isolated and testable |

---

## Architecture Notes

**`useGameEngine.js`** — the only place game state lives. Manages lives, score, the countdown interval, tile interaction, and pattern transitions. The timer uses `useRef` to avoid stale closures, and `clearInterval` is called in the effect cleanup to prevent memory leaks when the component unmounts or the game ends.

**Pattern generation** is pure functions (`buildDiamondPattern`, `buildBorderCrossPattern`) — no side effects, deterministic output for any grid size. This makes the math easy to reason about and trivial to test.

**Grid re-key** — the grid container carries `key={\`grid-${rows}-${cols}\`}` so React fully unmounts and remounts the tile tree when dimensions change, avoiding stale tile state bleeding across grid sizes.

---

## Local Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`.

---

## Deployment

```bash
npm run build        # outputs to /dist
# deploy /dist to Vercel / Netlify / GitHub Pages
```

---

## Project Structure

```
src/
├── components/
│   ├── Carousel.jsx     # Module 1 — game selection UI
│   └── GameGrid.jsx     # Module 2 — pattern grid game
├── hooks/
│   └── useGameEngine.js # All game logic in one place
├── App.jsx              # Root layout + module nav
├── main.jsx             # React entry point + loader dismiss
└── index.css            # Tailwind directives + global resets
```
