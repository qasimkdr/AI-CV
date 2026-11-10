import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // WebGL stack — only fetched when a 3D scene mounts (after idle)
            { name: 'three', test: /node_modules[\\/](three|@react-three|three-stdlib|maath|camera-controls|meshline|stats-gl|@monogrid|troika|detect-gpu|suspend-react|its-fine|zustand)/, priority: 10 },
            { name: 'docx', test: /node_modules[\\/](docx|file-saver|jszip)/, priority: 5 },
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler|cookie|set-cookie-parser)[\\/]/, priority: 40 },
            { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)/, priority: 30 },
          ],
        },
      },
    },
  },
})
