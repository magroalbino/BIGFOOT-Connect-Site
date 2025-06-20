// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F948C', // Verde-azulado
        secondary: '#FF6B35', // Laranja vibrante
        background: '#FFF9F5',
        card: '#FFFFFF',
        muted: '#F3F4F6',
        text: '#1F2937',
      },
    },
  },
  plugins: [],
};
