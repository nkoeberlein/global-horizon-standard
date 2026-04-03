import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from 'vite-plugin-web-extension';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
        webExtension({
            manifest: "manifest.json",
        }),
    ],
    resolve: {
        alias: {
            'ghs-time': path.resolve(__dirname, '../core/src/index.ts'),
        },
    },
});