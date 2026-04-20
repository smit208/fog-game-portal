/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'cursive'],
      },
      colors: {
        fog: {
          dark:   '#0a0a0f',
          card:   '#111118',
          border: '#1e1e2a',
          muted:  '#3a3a4a',
          text:   '#e8e8f0',
          dim:    '#7f7f9a',
        },
        tile: {
          blue:      '#2563eb',
          blueGlow:  '#3b82f6',
          red:       '#dc2626',
          green:     '#16a34a',
          collected: '#1e3a5f',
        },
      },
      keyframes: {
        blinkDanger: {
          '0%, 100%': { backgroundColor: '#dc2626' },
          '50%':      { backgroundColor: '#ffffff' },
        },
        levelUp: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(59,130,246,0.4)' },
          '50%':      { boxShadow: '0 0 20px 6px rgba(59,130,246,0.7)' },
        },
        slideUp: {
          from: { transform: 'translateY(24px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'blink-danger': 'blinkDanger 0.18s ease-in-out 4',
        'level-up':     'levelUp 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'slide-up':     'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':      'fadeIn 0.3s ease',
      },
    },
  },
  plugins: [],
}
