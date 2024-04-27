/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // we start to customize colors and fonts
  theme: {
    extend: {
      height: {
        header: '560px',
        rate: '400px',
      },
      fontSize: {
        h1: '2.6rem',
      },
      screens: {
        xs: '475px',
      },
      colors: {
        main: '#000000',
        subMain: '	#40826D',
        dry: '#36454F',
        star: '#FFB000',
        text: '#C0C0C0',
        border: '#C0C0C0',
        dryGray: '#E0D5D5',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
