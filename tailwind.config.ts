import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'deep-brown': {
          DEFAULT: '#2C1810',
          light: '#3D251C',
        },
        'terracotta': {
          DEFAULT: '#A0522D',
          light: '#C26B3D',
        },
        'forest-green': {
          DEFAULT: '#004D2C',
          light: '#006B3D',
        },
        'soft-beige': '#F5F1EA',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      opacity: {
        '5': '0.05',
        '10': '0.1',
        '80': '0.8',
        '90': '0.9',
      },
    },
  },
  plugins: [],
} satisfies Config;
