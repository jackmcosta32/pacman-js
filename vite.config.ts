import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@tests': path.resolve(__dirname, './src/tests'),
      '@pacman': path.resolve(__dirname, './src/app/pacman'),
      '@shared': path.resolve(__dirname, './src/packages/shared'),
      '@game-client': path.resolve(__dirname, './src/packages/game-client'),
      '@game-engine': path.resolve(__dirname, './src/packages/game-engine'),
      '@game-application': path.resolve(__dirname, './src/packages/game-application'),
    },
  },
});
