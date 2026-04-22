import { useState, useEffect, useCallback, useRef } from 'react';

// Tile type constants – an object map is easier to extend than an enum
export const TILE = {
  GREEN:    'green',
  BLUE:     'blue',
  RED:      'red',
  COLLECTED:'collected',
};

// Which pattern to build
export const PATTERN = {
  ONE: 1,
  TWO: 2,
};

const MAX_LIVES = 5;
const ROUND_SECONDS = 30;

// ── Pattern generators ──────────────────────────────────────────────────────

/**
 * Pattern 1 – Diamond.
 * The diamond is centered and sized to roughly half the shorter dimension.
 */
function buildDiamondPattern(rows, cols) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(TILE.GREEN));
  const cx = Math.floor(rows / 2);
  const cy = Math.floor(cols / 2);
  // radius scales with the smaller axis so it always fits
  const radius = Math.floor(Math.min(rows, cols) / 4);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dist = Math.abs(r - cx) + Math.abs(c - cy);
      if (dist === radius) {
        grid[r][c] = TILE.BLUE;   // outline = points
      } else if (dist < radius) {
        grid[r][c] = TILE.RED;    // interior = danger
      }
    }
  }
  return grid;
}

/**
 * Pattern 2 – Border ring + inner cross.
 * Outer 2-tile ring = blue, alternating cross = red, rest = green.
 */
function buildBorderCrossPattern(rows, cols) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(TILE.GREEN));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isOuterBorder = r < 2 || r >= rows - 2 || c < 2 || c >= cols - 2;
      // Cross arms down the middle rows/cols
      const isCrossRow = r === Math.floor(rows / 2) || r === Math.floor(rows / 2) - 1;
      const isCrossCol = c === Math.floor(cols / 2) || c === Math.floor(cols / 2) - 1;

      if (isOuterBorder) {
        grid[r][c] = TILE.BLUE;
      } else if (isCrossRow || isCrossCol) {
        // Make cross cells alternate between RED and GREEN so it's not trivial
        grid[r][c] = (r + c) % 2 === 0 ? TILE.RED : TILE.GREEN;
      }
    }
  }
  return grid;
}

export function buildPattern(pattern, rows, cols) {
  return pattern === PATTERN.ONE
    ? buildDiamondPattern(rows, cols)
    : buildBorderCrossPattern(rows, cols);
}

function countBlue(grid) {
  return grid.flat().filter(t => t === TILE.BLUE).length;
}

// ── Game states ─────────────────────────────────────────────────────────────

export const GAME_STATE = {
  IDLE:    'idle',
  PLAYING: 'playing',
  WON:     'won',
  LOST:    'lost',
};

// ── The hook ─────────────────────────────────────────────────────────────────

export function useGameEngine(rows, cols) {
  const [activePattern, setActivePattern]   = useState(PATTERN.ONE);
  const [grid, setGrid]                     = useState(() => buildPattern(PATTERN.ONE, rows, cols));
  const [gameState, setGameState]           = useState(GAME_STATE.IDLE);
  const [lives, setLives]                   = useState(MAX_LIVES);
  const [score, setScore]                   = useState(0);
  const [secondsLeft, setSecondsLeft]       = useState(ROUND_SECONDS);
  const [blinkingCell, setBlinkingCell]     = useState(null);
  const [hasLevelOneCompleted, setHasLevelOneCompleted] = useState(false);

  // Ref lets the interval always read current 'secondsLeft' without stale closure
  const secondsRef = useRef(secondsLeft);
  secondsRef.current = secondsLeft;
  const timerRef = useRef(null);

  // Rebuild grid whenever dimensions or pattern changes
  useEffect(() => {
    setGrid(buildPattern(activePattern, rows, cols));
  }, [rows, cols, activePattern]);

  // ── Timer ──
  useEffect(() => {
    if (gameState !== GAME_STATE.PLAYING) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const next = secondsRef.current - 1;
      if (next <= 0) {
        clearInterval(timerRef.current);
        setSecondsLeft(0);
        setGameState(GAME_STATE.LOST);
      } else {
        setSecondsLeft(next);
      }
    }, 1000);

    // Crucial: clean up so we never accumulate ghost intervals
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // ── Check lose condition (lives running out) ──
  useEffect(() => {
    if (lives <= 0 && gameState === GAME_STATE.PLAYING) {
      setGameState(GAME_STATE.LOST);
    }
  }, [lives, gameState]);

  // ── Tile interaction ──
  const handleTileClick = useCallback((row, col) => {
    if (gameState !== GAME_STATE.PLAYING) return;

    const tileType = grid[row][col];

    if (tileType === TILE.BLUE) {
      // Mark tile as collected, update score
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = TILE.COLLECTED;

        // Check if all blue tiles in this pattern are gone
        const remaining = countBlue(next);
        if (remaining === 0) {
          if (activePattern === PATTERN.ONE) {
            // Auto-advance to pattern 2
            setHasLevelOneCompleted(true);
            setActivePattern(PATTERN.TWO);
            setSecondsLeft(ROUND_SECONDS);           // fresh timer
            return buildPattern(PATTERN.TWO, rows, cols); // immediately rebuild
          } else {
            // Beat pattern 2 → win!
            setGameState(GAME_STATE.WON);
          }
        }
        return next;
      });
      setScore(s => s + 10);
    } else if (tileType === TILE.RED) {
      // Blink animation, then subtract a life
      setBlinkingCell({ row, col });
      setTimeout(() => setBlinkingCell(null), 800);
      setLives(l => l - 1);
    }
    // GREEN tiles: safe – nothing happens
  }, [gameState, grid, activePattern, rows, cols]);

  const startGame = useCallback(() => {
    const fresh = buildPattern(PATTERN.ONE, rows, cols);
    setGrid(fresh);
    setActivePattern(PATTERN.ONE);
    setLives(MAX_LIVES);
    setScore(0);
    setSecondsLeft(ROUND_SECONDS);
    setBlinkingCell(null);
    setHasLevelOneCompleted(false);
    setGameState(GAME_STATE.PLAYING);
  }, [rows, cols]);

  const resetGame = useCallback(() => {
    clearInterval(timerRef.current);
    startGame();
  }, [startGame]);

  // Manual pattern switch (for the toggle button in the UI)
  const switchPattern = useCallback((p) => {
    if (gameState === GAME_STATE.PLAYING) return; // don't allow mid-game switching
    setActivePattern(p);
  }, [gameState]);

  return {
    grid,
    gameState,
    lives,
    score,
    secondsLeft,
    activePattern,
    blinkingCell,
    hasLevelOneCompleted,
    handleTileClick,
    startGame,
    resetGame,
    switchPattern,
    MAX_LIVES,
    ROUND_SECONDS,
  };
}
