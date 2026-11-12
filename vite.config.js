import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Cada persona es un perfil de src/profiles/ y se publica como una app aparte:
// el perfil principal en /<repo>/ y el resto en /<repo>/<perfil>/.
// El workflow pasa PROFILE y BASE_PATH en cada compilación.
const MAIN_PROFILE = 'jonathan';
const profile = process.env.PROFILE || MAIN_PROFILE;
const profilesDir = fileURLToPath(new URL('./src/profiles/', import.meta.url));
const config = JSON.parse(readFileSync(`${profilesDir}${profile}/profile.json`, 'utf8'));
const base = process.env.BASE_PATH || '/';

// La app principal no debe abrir su propia página en los enlaces de los demás perfiles.
const others = readdirSync(profilesDir).filter((p) => p !== MAIN_PROFILE);
const denylist = profile === MAIN_PROFILE ? others.map((p) => new RegExp(`^${base}${p}(/|$)`)) : [];

export default defineConfig({
  base,
  resolve: {
    alias: { '@profile': `${profilesDir}${profile}` },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        id: base,
        name: config.appName,
        short_name: config.shortName,
        description: 'Registra tus pesos en cada entrenamiento y sigue tu progresión semanal.',
        lang: 'es',
        theme_color: '#f5f6f1',
        background_color: '#f5f6f1',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        globIgnores: others.map((p) => `${p}/**`),
        navigateFallbackDenylist: denylist,
      },
    }),
  ],
});
