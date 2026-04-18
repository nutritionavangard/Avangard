import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://avangard-backend.onrender.com', // Reemplaza con la URL real de tu backend en Render
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  }
})