import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Важно: в dev режиме мы проксируем /api -> backend, чтобы не настраивать CORS.
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          // /api/vacancy -> /vacancy
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
