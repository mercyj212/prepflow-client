import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://prepflow-server.onrender.com', // PRODUCTION
        // target: 'http://127.0.0.1:10000', // LOCAL DEV
        changeOrigin: true,
        secure: true
      }
    }
  }
})