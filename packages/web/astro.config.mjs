import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const localCoreSrc = path.resolve(__dirname, '../core/src/index.ts');

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: fs.existsSync(localCoreSrc) ? { 'ghs-time': localCoreSrc } : undefined,
    },
  },
});
