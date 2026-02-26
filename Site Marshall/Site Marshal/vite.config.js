import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,          // listen on 0.0.0.0, not just localhost
    allowedHosts: [
      'endoparasitic-manda-overdry.ngrok-free.dev',
      '.ngrok-free.app',
      '.ngrok-free.dev',
    ],
    proxy: {
      // Proxy all /api/* requests to the Flask backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
