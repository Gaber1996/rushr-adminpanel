/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Montserrat is the app font, so every element gets it without a class.
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      // Design tokens: the Figma palette. Use these names instead of hex values.
      colors: {
        ink: '#0F0F0F', // body text
        heading: '#202020', // page and card titles
        muted: '#6A6A6A', // secondary text, icons
        line: '#D9D9D9', // borders, dividers
        surface: {
          DEFAULT: '#FEFEFE', // page and input background
          subtle: '#FAFAFA', // table header, zebra rows
          muted: '#F7F7F7', // grey cards
        },
        primary: {
          DEFAULT: '#0067DE',
          strong: '#0052B0', // text on light buttons
          soft: '#ECF5FF', // active nav, hover tint
        },
        danger: '#C20A0A',
        success: {
          DEFAULT: '#00861D',
          soft: '#EFFFF5',
        },
        warning: {
          DEFAULT: '#D97706',
          soft: '#FFFBF3',
        },
      },
      borderRadius: {
        '3xl': '44px',
      },
      screens: {
        // Sidebar (300) + page padding (80) + the dispute details columns (716 + 24 + 320).
        wide: '1440px',
      },
    },
  },
  plugins: [],
}
