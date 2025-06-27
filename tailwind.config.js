/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'green-200': '#6ee7b7',
        'yellow-100': '#fefcbf',
      },
    },
  },
  plugins: [],
};
