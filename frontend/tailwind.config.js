/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      colors: {
        silver: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#8c959d',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        accent: {
          light: '#6366f1',
          dark: '#818cf8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0,0,0,0.06)',
        'soft-dark': '0 4px 24px rgba(0,0,0,0.3)',
        'glow': '0 0 24px rgba(99,102,241,0.25)',
        'glow-dark': '0 0 24px rgba(129,140,248,0.2)',
      },
    },
  },
  plugins: [],
}
