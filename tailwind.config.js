/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cores principais do BIGFOOT Connect
        primary: {
          50: '#e6f7f5',
          100: '#b3e8e1',
          200: '#80d8cd',
          300: '#4dc9b9',
          400: '#1ab9a5',
          500: '#1F948C', // Cor principal
          600: '#197670',
          700: '#145954',
          800: '#0e3b38',
          900: '#091e1c',
        },
        accent: {
          50: '#fff4ed',
          100: '#ffe0cc',
          200: '#ffcdaa',
          300: '#ffb988',
          400: '#ffa666',
          500: '#FF6B35', // Cor de destaque
          600: '#e55a2b',
          700: '#cc4922',
          800: '#b33818',
          900: '#99270e',
        },
        success: {
          50: '#e6f9f2',
          100: '#b3eed9',
          200: '#80e3c0',
          300: '#4dd8a7',
          400: '#1acd8e',
          500: '#10B981',
          600: '#0d9467',
          700: '#0a6f4d',
          800: '#074a33',
          900: '#042519',
        },
        error: {
          50: '#fdecea',
          100: '#f9c6c0',
          200: '#f5a096',
          300: '#f17a6c',
          400: '#ed5442',
          500: '#EF4444',
          600: '#d63838',
          700: '#bd2c2c',
          800: '#a42020',
          900: '#8b1414',
        },
        warning: {
          50: '#fef5e7',
          100: '#fce4b8',
          200: '#fad389',
          300: '#f8c25a',
          400: '#f6b12b',
          500: '#F59E0B',
          600: '#dc8e0a',
          700: '#c37e09',
          800: '#aa6e08',
          900: '#915e07',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Cores para temas dark/light
        dark: {
          bg: '#000000',
          card: '#111111',
          border: '#333333',
          text: '#ffffff',
          'text-secondary': '#e0e0e0',
        },
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          text: '#1a202c',
          'text-secondary': '#4a5568',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        '2xs': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'primary': '0 4px 15px rgba(31, 148, 140, 0.3)',
        'accent': '0 4px 15px rgba(255, 107, 53, 0.3)',
        'success': '0 4px 15px rgba(16, 185, 129, 0.3)',
        'error': '0 4px 15px rgba(239, 68, 68, 0.3)',
        'glow': '0 0 20px rgba(31, 148, 140, 0.4)',
        'glow-accent': '0 0 20px rgba(255, 107, 53, 0.4)',
        'card': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 15px 35px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #1F948C 0%, #10B981 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%)',
        'gradient-dark': 'linear-gradient(45deg, #000 0%, #111 50%, #000 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      minHeight: {
        'screen-90': '90vh',
        'screen-80': '80vh',
        'screen-70': '70vh',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      screens: {
        'xs': '480px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    // Plugin customizado para utility classes
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-gradient-primary': {
          background: 'linear-gradient(135deg, #1F948C 0%, #10B981 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-accent': {
          background: 'linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-glass': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.bg-glass-dark': {
          'background': 'rgba(0, 0, 0, 0.3)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#1F948C #1a1a1a',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1a1a1a',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#1F948C',
            'border-radius': '4px',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
