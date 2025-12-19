import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8086',
        changeOrigin: true
      },
      '/v3': {
        target: 'http://127.0.0.1:8086',
        changeOrigin: true
      },
      '/swagger-ui': {
        target: 'http://127.0.0.1:8086',
        changeOrigin: true
      }
    }
  }
})
