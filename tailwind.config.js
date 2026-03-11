/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: '#FF6B35',
        yellow: '#FFD93D',
        blue: '#4D96FF',
        green: '#6BCB77',
        pink: '#FF6B9D',
        cream: '#FFFBF0',
        dark: '#1A1A2E',
      },
      fontFamily: {
        fredoka: ['"Fredoka One"', 'cursive'],
        nunito: ['Nunito', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        waggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delay-2': 'float 6s ease-in-out 2s infinite',
        'float-delay-4': 'float 6s ease-in-out 4s infinite',
        waggle: 'waggle 1s ease-in-out infinite',
        popIn: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        slideUp: 'slideUp 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
