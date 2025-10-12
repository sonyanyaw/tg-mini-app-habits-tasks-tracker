import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    
    port: 5173,
    allowedHosts: ['early-pets-retire.loca.lt'],
    proxy: {
      '/api': {
        target: "https://habittasktracker-sysliks29.amvera.io/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
