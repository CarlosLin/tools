// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  vite: {
    define: {
      'global.File': 'globalThis.File'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    'shadcn-nuxt'
  ],

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true
  },

  eslint: {
    config: {
      stylistic: true
    }
  }
})
