import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages base path - update 'ai-trader' to your repo name
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
