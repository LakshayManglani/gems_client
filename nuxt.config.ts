import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui'],
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
});
