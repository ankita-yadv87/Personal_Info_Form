import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // Match the API path you want to proxy
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true, // Change the origin header to the target URL
        secure: false, // Disable SSL verification for development
      },
    },
  },
})
