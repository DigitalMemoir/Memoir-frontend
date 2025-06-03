/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'src/newtab/index.html'),
        popup: resolve(__dirname, 'src/popup/index.html'),
      },
    },
  },
});
