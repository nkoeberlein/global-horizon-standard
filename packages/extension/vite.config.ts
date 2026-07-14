import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    webExtension({
      manifest: 'manifest.json',
    }),
  ],
  resolve: {
    alias: {
      'ghs-time': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
});
