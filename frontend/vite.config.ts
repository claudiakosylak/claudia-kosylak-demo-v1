import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, '..'), // Look for .env files in parent directory (monorepo root)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: parseInt(process.env.VITE_FRONTEND_PORT || '3000'),
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
