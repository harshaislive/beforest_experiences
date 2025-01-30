/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        'deep-brown': 'var(--deep-brown)',
        'terracotta': 'var(--terracotta)',
        'forest-green': 'var(--forest-green)',
        'soft-beige': 'var(--soft-beige)',
        'deep-brown-light': 'var(--deep-brown-light)',
        'terracotta-light': 'var(--terracotta-light)',
        'forest-green-light': 'var(--forest-green-light)',
      },
      textColor: {
        'primary': 'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
      },
      backgroundColor: theme => ({
        ...theme('colors'),
      }),
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
} 