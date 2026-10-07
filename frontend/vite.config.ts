import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Safari 12 (iPhone 6 Plus, iOS 12) carga módulos, pero no entiende ?? ni ?.
  // Este destino traduce esa sintaxis al publicar, sin cambiar las pantallas.
  build: {
    target: 'safari12',
  },
})
