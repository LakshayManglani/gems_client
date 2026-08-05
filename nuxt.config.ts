import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@vite-pwa/nuxt'
  ],
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'Gems',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  appConfig: {
    ui: {
      colors: {
        primary: 'brand',
        neutral: 'neutral',
      },
    },
    fonts: {
      families: [
        { name: 'Cormorant Garamond', provider: 'google' },
      ]
    }
  },
  routeRules: {
    "/gems": {
      swr: 5,
    }
  },

  runtimeConfig: {
    apiBase: "http://localhost:8080",
  },

  image: {
    quality: 100,
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dxnuagdft/image/upload/'
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    client: {
      installPrompt: true,
    },
    manifest: {
      name: 'Gems',
      short_name: 'Gems',
      description: 'Curated natural & certified gemstones.',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
    },
    pwaAssets: {
      config: true,
    },
    workbox: {
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      disableDevLogs: true,
    },
    devOptions: {
      enabled: false,
      type: 'module',
      navigateFallback: '/',
      suppressWarnings: true
    },

  },
});
