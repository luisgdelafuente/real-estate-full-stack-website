/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#252359',
          dark: '#1a1a40',
          light: '#373684',
        },
        secondary: {
          DEFAULT: '#2D3773',
          dark: '#232a58',
          light: '#3a478f',
        },
        accent: {
          DEFAULT: '#7A8CBF',
          dark: '#6273a6',
          light: '#92a0cd',
        },
        neutral: {
          DEFAULT: '#8095BF',
          dark: '#6a7ca5',
          light: '#96aad3',
        },
        dark: '#0D0D0D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};