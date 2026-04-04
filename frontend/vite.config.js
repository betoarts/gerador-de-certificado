import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Dev only – proxy API calls to local backend
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/outputs': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/assets': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // Inline assets below 4kb, externalize the rest
    assetsInlineLimit: 4096,
  },
})
