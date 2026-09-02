/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        aqi: {
          good: '#059669',
          satisfactory: '#65A30D',
          moderate: '#D97706',
          poor: '#DC2626',
          verypoor: '#7C3AED',
          severe: '#881337',
        }
      }
    },
  },
  plugins: [],
}
