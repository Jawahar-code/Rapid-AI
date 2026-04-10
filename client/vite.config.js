import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // This forces Vite to ignore Windows signals and check the files itself
      usePolling: true,
      interval: 100, 
      binaryInterval: 300 
    }
  }
})