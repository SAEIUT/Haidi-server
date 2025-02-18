import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',  // Assure-toi que le root est bien défini
  build: {
    outDir: 'dist',  // Où sera généré le build
    emptyOutDir: true, // Nettoie le dossier avant build
  }
});
