import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const localCoreSrc = path.resolve(__dirname, '../core/src/index.ts');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: fs.existsSync(localCoreSrc) ? { 'ghs-time': localCoreSrc } : undefined,
  },
});
