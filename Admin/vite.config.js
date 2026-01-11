import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // Only for local development
  },
  build: {
    outDir: 'dist', // Ensure output folder is correct
  }
});
