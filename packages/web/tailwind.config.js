/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#faf9f6',
        'cream-dark': '#f0ede6',
        charcoal: '#2d2926',
        'charcoal-light': '#5c5650',
        'sun-yellow': '#e8a820',
        'sun-yellow-light': '#f5d78a',
        sage: '#6b9e7a',
        'sage-light': '#a8c9b0',
        'aurora-purple': '#c4b5fd',
        'aurora-rose': '#fca5a5',
        'aurora-sky': '#bae6fd',
        amber: '#c8903a',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #e0d7ff 0%, #fce7f3 50%, #e0f2fe 100%)',
      },
    },
  },
  plugins: [],
};
