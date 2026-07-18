import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ai-cafe-network/',
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
  },
})
