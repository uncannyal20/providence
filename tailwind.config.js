/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Newsreader"', '"EB Garamond"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#FCFAF6',
          100: '#F7F3EB',
          200: '#EFE8DA',
          300: '#E2D6C0',
          400: '#CBBBA0',
          500: '#AF9D7D',
          600: '#8E7C5D',
          700: '#6E5F46',
          800: '#4F4432',
          900: '#332C20',
          950: '#1D1812',
        },
        sacred: {
          50: '#FAF6EE',
          100: '#F2E8D3',
          200: '#E4D1A7',
          300: '#D3B678',
          400: '#C29C52',
          500: '#A78036',
          600: '#876326',
          700: '#694B1E',
          800: '#4D3618',
          900: '#362512',
        },
        providence: {
          50: '#F4F7F6',
          100: '#E4EDE9',
          200: '#C7D9D0',
          300: '#A4C0B3',
          400: '#7FA192',
          500: '#608475',
          600: '#4B6A5D',
          700: '#3B5349',
          800: '#2C3D36',
          900: '#1F2B26',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-out-up': 'fadeOutUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOutUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '60%': { opacity: '0.4', transform: 'translateY(-24px) scale(0.96)' },
          '100%': { opacity: '0', transform: 'translateY(-48px) scale(0.92)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.82' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
