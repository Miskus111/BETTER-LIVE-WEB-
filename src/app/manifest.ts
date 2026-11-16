import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Better Live with Biohacking',
    short_name: 'BLWB',
    description: 'Trénink, výživa, mobilita, doplňky a laboratorní výsledky na jednom místě.',
    lang: 'cs',
    start_url: '/today',
    scope: '/',
    display: 'standalone',
    background_color: '#07090c',
    theme_color: '#07090c',
    categories: ['health', 'fitness', 'lifestyle'],
    icons: [
      { src: '/pwa-icon/192', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-icon/512', sizes: '512x512', type: 'image/png' },
      { src: '/pwa-icon/maskable-512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Trénink', url: '/train' },
      { name: 'Jídelníček', url: '/eat' },
      { name: 'Kouč', url: '/coach' },
    ],
  }
}
