/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#388E3C', // Fresh Nature Leaf Green (replaces dark #1B5E20)
          hover: '#2E7D32',
          light: '#66BB6A',
          dark: '#1B4332',
          surface: '#E8F5E9',
        },
        secondary: {
          DEFAULT: '#FFF3B0', // Light Yellow
          hover: '#FEE880',
          light: '#FFFBEA',
        },
        accent: {
          DEFAULT: '#F77F00', // Warm Orange
          hover: '#D96E00',
          light: '#FF9E33',
          dark: '#B85E00',
        },
        cream: '#FDFBF3',
        lightgreen: {
          DEFAULT: '#E8F5E9', // Fresh Sprout Green
          surface: '#F4FAF5',
          border: '#C8E6C9',
          hover: '#D5EED8',
          text: '#1E4620',
        },
        nature: {
          50: '#F4FAF5',
          100: '#E8F5E9',
          200: '#C8E6C9',
          300: '#A5D6A7',
          400: '#81C784',
          500: '#4CAF50',
          600: '#388E3C',
          700: '#2E7D32',
          800: '#1E4620',
          900: '#1B4332',
        },
        darktext: '#1A2E1A',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
