import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the app under /fog-game-portal/ in production
  base: process.env.NODE_ENV === 'production' ? '/fog-game-portal/' : '/',
})
