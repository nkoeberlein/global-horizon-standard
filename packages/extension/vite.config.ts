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
});
