import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves this repo from /schoolgame/ (a project-page subpath),
// while local dev/preview and other hosts (e.g. Vercel) serve it from the
// domain root — so the base path only changes when GH_PAGES is set by the
// Pages deploy workflow.
const base = process.env.GH_PAGES ? '/schoolgame/' : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Bilik Ustası',
        short_name: 'Bilik Ustası',
        description: 'Məktəblilər üçün fənlər üzrə vaxta qarşı bilik yoxlama oyunu.',
        lang: 'az',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#f4f5fb',
        theme_color: '#4f46e5',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
})
