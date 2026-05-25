import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],
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
        neutral: 'neutral',
      },
    },
  },
  routeRules: {
    "/gems": {
      swr: 5,
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_API_PROXY_TARGET,
        changeOrigin: true,
        cookieDomainRewrite: {
          '*': '',
        },
      },
    },

    routeRules: {
      '/api/**': {
        proxy: process.env.NUXT_API_PROXY_TARGET + '/**',
      },
    },
  },
});
