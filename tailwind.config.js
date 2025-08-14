module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pk-gold': '#FFD700',
        'pk-dark': '#0A0A0A',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 'box-shadow': '0 0 5px #FFD700' },
          '100%': { 'box-shadow': '0 0 20px #FFD700' },
        }
      }
    },
  },
  plugins: [],
}