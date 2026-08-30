/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        gold: 'var(--color-gold)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
      },
      backgroundImage: {
        'fade-top': 'linear-gradient(to top, var(--color-bg) 0%, transparent 100%)',
        'fade-bottom': 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
