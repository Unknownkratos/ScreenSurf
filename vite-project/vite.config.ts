// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'src/App.tsx', // Specify the entry point of your application
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001', // Proxy API requests to Express server
    },
  },
});
