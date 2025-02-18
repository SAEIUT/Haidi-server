import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),  // Le dossier contenant le front-end
  build: {
    outDir: path.resolve(__dirname),  // Le dossier où les fichiers construits seront placés
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),  // Chemin absolu vers index.html
    },
    emptyOutDir: true,  // Vide le dossier de sortie avant de construire
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',  // Exemple de proxy pour les requêtes API vers Express
    },
  },
});
