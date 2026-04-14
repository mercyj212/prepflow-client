import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://prepflow-server.onrender.com', // PRODUCTION
        // target: 'http://localhost:10000', // LOCAL DEV
        changeOrigin: true,
        secure: true
      }
    }
  }
})