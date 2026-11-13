import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const localCoreSrc = path.resolve(__dirname, '../core/src/index.ts');

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    webExtension({
      manifest: 'manifest.json',
    }),
  ],
  resolve: {
    alias: fs.existsSync(localCoreSrc) ? { 'ghs-time': localCoreSrc } : undefined,
  },
});
