import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0d0f1a',
          soft: '#13162a',
          muted: '#1c2040',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c96a',
          dark: '#8a6800',
        },
        ash: {
          DEFAULT: '#f0ece4',
          soft: '#d4cfc6',
          muted: '#8a8580',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
} satisfies Config
