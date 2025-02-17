import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),  // Garde ton alias actuel
    },
  },
  build: {
    outDir: 'dist', // Spécifie le dossier de sortie
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Assure que le bon fichier HTML est pris en compte
    },
  },
  base: '/', // Utilisation de la base "/" si ton app est à la racine
})  
