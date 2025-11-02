import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // 🔸 Base relativa: evita errores de rutas en Render
  base: './',

  plugins: [
    react(),
    // 🔹 Configuración de PWA
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Orden de Trabajo',
        short_name: 'OT Mantenimiento',
        description: 'Formulario digital de orden de trabajo Ausol',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      // 🔹 Cache para uso offline
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'document' ||
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image' ||
              request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ],

  // 🔹 Proxy local: redirige /api al backend de Django
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // backend local Django
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // (Opcional) si querés que Render muestre logs detallados
  build: {
    sourcemap: false,
  },
});
