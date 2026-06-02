/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'blob': 'blob 10s infinite alternate',
        'mesh-slow': 'meshFlow 25s infinite ease-in-out alternate',
        'mesh-medium': 'meshFlowMedium 20s infinite ease-in-out alternate',
        'mesh-fast': 'meshFlowFast 15s infinite ease-in-out alternate',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1) rotate(0deg)' },
          '33%': { transform: 'translate(50px, -70px) scale(1.2) rotate(120deg)' },
          '66%': { transform: 'translate(-40px, 40px) scale(0.8) rotate(240deg)' },
          '100%': { transform: 'translate(0px, 0px) scale(1) rotate(360deg)' },
        },
        meshFlow: {
          '0%': { transform: 'translate(0px, 0px) scale(1)', borderRadius: '50% 40% 60% 40% / 40% 50% 40% 60%' },
          '33%': { transform: 'translate(10%, -15%) scale(1.15)', borderRadius: '40% 65% 50% 60% / 55% 45% 65% 45%' },
          '66%': { transform: 'translate(-12%, 10%) scale(0.9)', borderRadius: '60% 40% 65% 45% / 45% 60% 40% 55%' },
          '100%': { transform: 'translate(0px, 0px) scale(1)', borderRadius: '50% 40% 60% 40% / 40% 50% 40% 60%' }
        },
        meshFlowMedium: {
          '0%': { transform: 'translate(0px, 0px) scale(1)', borderRadius: '40% 60% 45% 55% / 50% 45% 60% 40%' },
          '50%': { transform: 'translate(-15%, 15%) scale(1.2)', borderRadius: '60% 40% 65% 40% / 40% 60% 45% 55%' },
          '100%': { transform: 'translate(0px, 0px) scale(1)', borderRadius: '40% 60% 45% 55% / 50% 45% 60% 40%' }
        },
        meshFlowFast: {
          '0%': { transform: 'translate(0px, 0px) scale(1)', borderRadius: '60% 40% 60% 40% / 50% 50% 50% 50%' },
          '50%': { transform: 'translate(15%, -10%) scale(1.1) rotate(45deg)', borderRadius: '40% 60% 40% 60% / 60% 40% 60% 40%' },
          '100%': { transform: 'translate(0px, 0px) scale(1)', borderRadius: '60% 40% 60% 40% / 50% 50% 50% 50%' }
        }
      }
    },
  },
  plugins: [],
}