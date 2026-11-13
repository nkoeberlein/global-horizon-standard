/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f7f4ee',
        'cream-dark': '#efe9df',
        surface: '#fdfbf7',
        charcoal: '#1f1b16',
        'charcoal-light': '#5e554a',
        muted: '#7b7266',
        amber: '#b57924',
        sage: '#16a34a',
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
