/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          bg: '#FFFFFF',
          secondary: '#F7F7FA',
          card: '#F1E9FA',
          cardLight: '#F8F4FD',
          purple: '#8B45E8',
          'purple-hover': '#7835D8',
          blue: '#4263EB',
          'blue-hover': '#3652D9',
          border: '#E8E8ED',
          text: '#252525',
          muted: '#858585',
          found: '#16B978',
          'found-bg': '#E6F9F1',
          lost: '#E84383',
          'lost-bg': '#FDECF3',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(139, 69, 232, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(139, 69, 232, 0.07), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 12px 30px -4px rgba(139, 69, 232, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}

