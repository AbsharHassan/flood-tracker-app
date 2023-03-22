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
        themeBgColorDark: '#0e1824',
        themeCardColorDark: '#121e2d',
        themeBorderColorDark: '#162436',
        themeBgColorLight: '#f8f8f8',
        themeCardColorLight: '#fff',
        themeBorderColorLight: '#e9ebec',
      },
      height: {
        'calc-minus-65': 'calc(100% - 40px)',
      },
    },
  },
  plugins: [],
}
