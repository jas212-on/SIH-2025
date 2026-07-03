/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#effcfb',
          100: '#d6f6f3',
          200: '#b0ece7',
          300: '#7bdcd6',
          400: '#43c2bd',
          500: '#22a6a3',
          600: '#178685',
          700: '#166a6b',
          800: '#175456',
          900: '#164648',
          950: '#07282a',
        },
        ink: {
          50:  '#f6f7f9',
          100: '#eceef2',
          200: '#d4d9e1',
          300: '#aeb8c7',
          400: '#8391a7',
          500: '#64738c',
          600: '#4f5c74',
          700: '#414c5f',
          800: '#2c3441',
          900: '#181d26',
          950: '#0b0e13',
        },
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 6px -1px rgb(15 23 42 / 0.06)',
        'card': '0 2px 8px -2px rgb(15 23 42 / 0.08), 0 4px 20px -4px rgb(15 23 42 / 0.08)',
      },
      animation: {
        'slide-up': 'slide-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
