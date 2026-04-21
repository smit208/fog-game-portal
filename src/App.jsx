import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Tiny inline SVGs — same visual output as lucide-react but no extra dependency
function IconGamepad({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="12" y1="6" x2="12" y2="18" />
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconGrid({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
import Carousel from './components/Carousel';
import GameGrid from './components/GameGrid';
import './index.css';

// Each module maps to an icon + label.
const MODULES = [
  { id: 'select', Icon: IconGamepad, label: 'Game Select' },
  { id: 'grid',   Icon: IconGrid,    label: 'Pattern Grid' },
];

// Page-level cross-fade when switching modules
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter:   { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
};

export default function App() {
  const [activeModule, setActiveModule] = useState('select');

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* ── Top nav ── */}
      <header
        className="z-20 flex h-14 items-center justify-between px-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', willChange: 'transform' }}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-black tracking-widest text-white"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.1em' }}
          >
            FOG
          </span>
          <span className="hidden rounded-full bg-purple-600/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-400 sm:inline">
            Portal
          </span>
        </div>

        {/* Module toggle — sliding layoutId highlight, lucide icons, no emoji */}
        <nav
          className="flex overflow-hidden rounded-xl p-1"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {MODULES.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveModule(id)}
              className="relative flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
              style={{ color: activeModule === id ? '#fff' : 'rgba(255,255,255,0.4)' }}
            >
              {/* The spring-animated background that slides between options */}
              {activeModule === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon size={14} className="relative z-10 flex-shrink-0" />
              <span className="relative z-10 hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* Personal ownership — stays in top-right */}
        <span className="hidden text-xs text-white/30 sm:block">Smit Prajapati</span>
      </header>

      {/* ── Module area ── */}
      <main className="relative min-h-0 flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="h-full"
          >
            {activeModule === 'select' ? <Carousel /> : <GameGrid />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
