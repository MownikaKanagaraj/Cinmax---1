/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A3D78',
          dark: '#002754',
          light: '#1E5AAD',
          container: '#D5E3FF',
        },
        surface: {
          DEFAULT: '#F7F9FB',
          container: '#ECEEF0',
          card: '#FFFFFF',
        },
        text: {
          main: '#191C1E',
          muted: '#434750',
          tertiary: '#737781',
        },
        luxury: {
          gold: '#C5A880',
          accent: '#0A3D78',
        },
      },
    },
  },
  plugins: [],
};
