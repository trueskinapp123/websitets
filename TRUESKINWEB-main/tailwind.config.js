/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      colors: {
        trueskin: {
          'dark-brown': '#803716',
          'copper': '#b66837',
          'caramel': '#874c2b',
          'peach': '#e58f5a',
          'mocha': '#834b2f',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #e58f5a 0%, #b66837 50%, #803716 100%)',
      }
    },
  },
  plugins: [],
};