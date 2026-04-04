/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#0067DE',
          lightBlue: '#ECF5FF',
          black: '#0F0F0F',
          gray: '#6A6A6A',
          lightGray: '#D9D9D9',
          white: '#FEFEFE',
          green: '#035720',
          lightGreen: '#EFFFF5',
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '44px',
      },
    },
  },
  plugins: [],
}
