/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        amber: {
          primary: '#E8913A',
          light: '#F5D5A8',
          dark: '#C67424',
          50: '#FFF8F0',
          100: '#FEEFD9',
          200: '#FCDDAF',
          300: '#F9C678',
          400: '#F5A94A',
          500: '#E8913A',
          600: '#C67424',
          700: '#9E581B',
          800: '#7A4419',
          900: '#633818',
        },
        warm: {
          50: '#FAF7F3',
          100: '#F5F0EB',
          200: '#EDE5DA',
          300: '#DDD2C2',
          400: '#C5B59E',
          500: '#A89880',
          600: '#8E7E68',
          700: '#746554',
          800: '#5C5044',
          900: '#4A4139',
        },
        tag: {
          wait: '#E53E3E',
          price: '#D69E2E',
          good: '#38A169',
          bad: '#C53030',
          taste: '#3182CE',
          recommend: '#38A169',
          review: '#E53E3E',
          hygiene: '#805AD5',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      maxWidth: {
        'app': '430px',
      },
    },
  },
  plugins: [],
};
