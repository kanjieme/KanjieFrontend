export default defineNuxtConfig({
  compatibilityDate: '2026-05-24',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/', '/verify/*'],
    },
  },
  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL || 'https://kanjie12-kanjime.hf.space',
      appName: 'KanjiMe 漢字',
    },
  },
  app: {
    head: {
      title: 'KanjiMe 漢字 — Belajar JLPT N3 & N2',
      meta: [
        { name: 'description', content: 'Platform belajar bahasa Jepang JLPT N3 & N2 dengan sertifikasi resmi.' },
        { name: 'theme-color', content: '#0d0f1a' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
})
