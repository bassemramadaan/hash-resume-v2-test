import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isProduction
        ? [
            visualizer({
              filename: 'dist/stats.html',
              template: 'treemap',
              gzipSize: true,
              brotliSize: true,
              open: false,
            }),
          ]
        : []),
    ],
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(env.GOOGLE_MAPS_PLATFORM_KEY || process.env.GOOGLE_MAPS_PLATFORM_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('node_modules/react/') ||
                id.includes('node_modules/react-dom/') ||
                id.includes('node_modules/react-router/') ||
                id.includes('node_modules/react-router-dom/') ||
                id.includes('node_modules/zustand/') ||
                id.includes('node_modules/scheduler/')
              ) {
                return 'react-vendor';
              }
              if (
                id.includes('node_modules/i18next/') ||
                id.includes('node_modules/react-i18next/') ||
                id.includes('node_modules/i18next-browser-languagedetector/') ||
                id.includes('node_modules/i18next-http-backend/')
              ) {
                return 'i18n-vendor';
              }
              if (
                id.includes('node_modules/jspdf/') ||
                id.includes('node_modules/html2canvas-pro/') ||
                id.includes('node_modules/html2canvas/') ||
                id.includes('node_modules/pdfjs-dist/') ||
                id.includes('node_modules/fflate/')
              ) {
                return 'pdf-vendor';
              }
              if (id.includes('node_modules/@google/genai/')) {
                return 'ai-vendor';
              }
              if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
                return 'firebase-vendor';
              }
              if (id.includes('node_modules/lucide-react/')) {
                return 'icons-vendor';
              }
              if (
                id.includes('node_modules/motion/') ||
                id.includes('node_modules/framer-motion/') ||
                id.includes('node_modules/canvas-confetti/')
              ) {
                return 'motion-vendor';
              }
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
