import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Game catalogue ───────────────────────────────────────────────────────────
// Swap `thumb` for the actual assets from the Drive folder when available.
const GAMES = [
  {
    id: 1,
    title: 'Shadow Descent',
    genre: 'Roguelite',
    rating: '4.8',
    thumb: 'https://images.unsplash.com/photo-1640955011254-39734e60b16f?w=600&q=80',
    accent: '#7c3aed',
    players: '1–2',
  },
  {
    id: 2,
    title: 'Outbreak Zero',
    genre: 'Survival',
    rating: '4.5',
    thumb: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&q=80',
    accent: '#dc2626',
    players: '1–4',
  },
  {
    id: 3,
    title: 'Iron Covenant',
    genre: 'Action RPG',
    rating: '4.7',
    thumb: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=600&q=80',
    accent: '#0ea5e9',
    players: '1',
  },
  {
    id: 4,
    title: 'Burning Circuit',
    genre: 'Racing',
    rating: '4.6',
    thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80',
    accent: '#f59e0b',
    players: '1–8',
  },
  {
    id: 5,
    title: 'Lockdown Protocol',
    genre: 'Puzzle',
    rating: '4.9',
    thumb: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80',
    accent: '#10b981',
    players: '1',
  },
];

// A landscape dummy video that actually loads
const DUMMY_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// ── GameCard ─────────────────────────────────────────────────────────────────

function GameCard({ game, isActive, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      layout
      onClick={onClick}
      className="no-select relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl"
      style={{ width: isActive ? 280 : 220   }}
      animate={{
        scale: isActive ? 1 : 0.84,
        opacity: isActive ? 1 : 0.42,
        filter: isActive ? 'brightness(1) saturate(1)' : 'brightness(0.45) saturate(0.5)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={!isActive ? { opacity: 0.8, scale: 0.92 } : {}}
      whileTap={{ scale: 0.97 }}
    >
      {/* Skeleton while image loads */}
      {!imgLoaded && (
        <div
          className="absolute inset-0 animate-pulse rounded-2xl"
          style={{ background: 'linear-gradient(90deg, #1a1a26 25%, #22222f 50%, #1a1a26 75%)' }}
        />
      )}

      {/* Aspect-video thumbnail */}
      <div className="aspect-video w-full">
        <img
          src={game.thumb}
          alt={game.title}
          onLoad={() => setImgLoaded(true)}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3/5"
        style={{
          background: `linear-gradient(to top, ${game.accent}cc 0%, transparent 100%)`,
        }}
      />

      {/* Card info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span
          className="mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ background: game.accent + '33', color: game.accent, border: `1px solid ${game.accent}55` }}
        >
          {game.genre}
        </span>
        <h3 className="text-base font-bold leading-tight text-white">{game.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/70">
          <span>⭐ {game.rating}</span>
          <span>·</span>
          <span>👤 {game.players}</span>
        </div>
      </div>

      {/* Active ring */}
      {isActive && (
        <motion.div
          layoutId="active-ring"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ boxShadow: `0 0 0 2px ${game.accent}, 0 0 24px 4px ${game.accent}55` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  );
}

// ── VideoOverlay ──────────────────────────────────────────────────────────────

function VideoOverlay({ game, onClose }) {
  const ref = useRef(null);

  // No need for a manual .play() call — the autoPlay attribute handles it.
  // We still keep the ref in case we want to seek or pause later.

  return (
    <AnimatePresence>
      <motion.div
        key="video-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.85)' }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl px-4"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header bar */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: game.accent }}>
                Now playing
              </p>
              <h2 className="text-xl font-bold text-white">{game.title}</h2>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
              }}
            >
              ✕ Close
            </motion.button>
          </div>

          {/* Video player — autoPlay + muted + loop makes it feel like a cinematic trailer, not a file viewer */}
          <div className="overflow-hidden rounded-2xl" style={{ boxShadow: `0 0 60px 10px ${game.accent}44` }}>
            <video
              ref={ref}
              src={DUMMY_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              className="aspect-video w-full bg-black"
              style={{ display: 'block' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Carousel (main export) ────────────────────────────────────────────────────

export default function Carousel() {
  const [activeIdx, setActiveIdx] = useState(2); // start at the middle card
  const [videoGame, setVideoGame] = useState(null);

  const goLeft  = useCallback(() => setActiveIdx(i => Math.max(0, i - 1)), []);
  const goRight = useCallback(() => setActiveIdx(i => Math.min(GAMES.length - 1, i + 1)), []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  goLeft();
      if (e.key === 'ArrowRight') goRight();
      if (e.key === 'Escape')     setVideoGame(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goLeft, goRight]);

  // Touch / pointer swipe on the carousel strip
  const handleDragEnd = (_e, info) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goRight();
    else if (info.offset.x >  threshold) goLeft();
  };

  const activeGame = GAMES[activeIdx];

  return (
    <div className="flex h-full flex-col items-center justify-center py-8 select-none">
      {/* Background tint that shifts with the active game's accent colour */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ willChange: 'background' }}
        animate={{ background: `radial-gradient(ellipse at 50% 60%, ${activeGame.accent}28 0%, transparent 70%)` }}
        transition={{ duration: 0.8 }}
      />

      {/* Section heading */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.04em' }}>
          Featured Titles
        </h1>
        <p className="mt-1 text-sm text-white/50">Drag to browse · use arrow keys to navigate · click the active card to preview</p>
      </motion.div>

      {/* Carousel strip */}
      <motion.div
        className="flex cursor-grab items-center gap-5 active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
      >
        {GAMES.map((game, idx) => (
          <GameCard
            key={game.id}
            game={game}
            isActive={idx === activeIdx}
            onClick={() => {
              if (idx === activeIdx) {
                // Second click on active card → show video
                setVideoGame(game);
              } else {
                setActiveIdx(idx);
              }
            }}
          />
        ))}
      </motion.div>

      {/* Dot indicators — keyed by game id, not array index */}
      <div className="mt-6 flex gap-2">
        {GAMES.map((game, i) => (
          <button
            key={game.id}
            aria-label={`Select ${game.title}`}
            onClick={() => setActiveIdx(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === activeIdx ? 28 : 8,
              background: i === activeIdx ? activeGame.accent : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={goLeft}
          disabled={activeIdx === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity"
          style={{ background: 'rgba(255,255,255,0.08)', opacity: activeIdx === 0 ? 0.3 : 1 }}
        >
          ←
        </button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setVideoGame(activeGame)}
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-white"
          style={{ background: activeGame.accent, boxShadow: `0 0 20px 4px ${activeGame.accent}55` }}
        >
          ▶ Play Now
        </motion.button>

        <button
          onClick={goRight}
          disabled={activeIdx === GAMES.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity"
          style={{ background: 'rgba(255,255,255,0.08)', opacity: activeIdx === GAMES.length - 1 ? 0.3 : 1 }}
        >
          →
        </button>
      </div>

      {/* Mobile swipe hint */}
      <p className="mt-4 text-xs text-white/25">← swipe →</p>

      {/* Video overlay */}
      {videoGame && <VideoOverlay game={videoGame} onClose={() => setVideoGame(null)} />}
    </div>
  );
}
