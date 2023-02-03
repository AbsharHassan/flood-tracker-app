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
    },
  },
  plugins: [],
}
