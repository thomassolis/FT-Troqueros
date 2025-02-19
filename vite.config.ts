import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs' // ✅ Solución para ESM

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./ssl/key.pem'), // Ruta a la clave privada
      cert: fs.readFileSync('./ssl/cert.pem'), // Ruta al certificado
    },
    port: 5173,
  },
  plugins: [react()],
})
