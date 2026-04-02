import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point directly at TypeScript source — Vite/esbuild handles compilation.
      // This avoids npm workspace symlinks (exFAT doesn't support them).
      'ghs-time': path.resolve(__dirname, '../core/src/index.ts'),
      'ghs-ui': path.resolve(__dirname, '../ui/src/index.ts'),
    },
  },
});
