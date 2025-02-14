/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          troquerosOrange: 'rgba(255, 156, 67, 100)',
          troquerosGray: 'rgba(217, 217, 217, 100)'
        },
        fontFamily: {
          inria: ['Inria Serif', 'serif'],
          jersey: ["Jersey 15", "sans-serif"],
          bebas: ["Bebas Neue", "sans-serif"],

        },
        backgroundImage: {
          'troqueros-logo': "url('./public/troqueros-logo.png')"
        }
      },
    },
    plugins: [require("@iconify/tailwind")]
  }