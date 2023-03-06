/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xxs: '350px',
        // => @media (min-width: 350px) { ... }
        xs: '450px',
      },
      colors: {
        themeBgColor: '#0e1824',
        themeCardColor: '#121e2d',
        themeBorderColor: '#162436',
      },
    },
  },
  plugins: [],
}
