import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sk: resolve(__dirname, 'sk/index.html'),
        rs: resolve(__dirname, 'rs/index.html'),
        ua: resolve(__dirname, 'ua/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
      },
    },
  },
});
