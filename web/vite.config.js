import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',  // Assure-toi que le root est bien défini
  build: {
    rollupOptions: {
      input: 'index.html', // Spécifie l'entrée correcte pour ton fichier index.html
    },
  },
  assetsInclude: ['**/*.html'], // Assure que les fichiers .html sont traités comme des ressources statiques
});

