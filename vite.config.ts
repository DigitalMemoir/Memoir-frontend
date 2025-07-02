/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  dotenv.config();
  const isDev = mode === 'development';
  const manifestSrc = isDev
    ? resolve(__dirname, 'public', 'manifest.dev.json')
    : resolve(__dirname, 'public', 'manifest.prod.json');
  const API_URL = process.env.VITE_API_URL!;

  return {
    plugins: [
      react(),
      tailwindcss(),
      viteStaticCopy({
        targets: [
          {
            src: manifestSrc,
            dest: '.',
            rename: 'manifest.json',
            transform: (content) =>
              content.toString().replace(/__API_URL__/g, API_URL),
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'), // ✅ 여기가 핵심!
      },
    },
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'public'),
    build: {
      emptyOutDir: true,
      outDir: resolve(__dirname, 'build'),
      rollupOptions: {
        input: {
          newtab: resolve(__dirname, 'src/newtab/index.html'),
          popup: resolve(__dirname, 'src/popup/index.html'),
        },
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/back-api': {
          target: API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
