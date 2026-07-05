import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
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
        primary: 'blue',
        neutral: 'zinc',
      },
    },
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
    manifest: {
      name: 'Gems',
      short_name: 'Gems',
      description: 'Curated natural & certified gemstones.',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      icons: [
        {
          src: '/logo-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/logo-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      cleanupOutdatedCaches: true,
      clientsClaim: true
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
});
