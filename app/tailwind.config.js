/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sony: {
          black: '#000000',
          dark: '#1a1a1a',
          gray: '#2d2d2d',
          light: '#3d3d3d',
          accent: '#0066cc',
          red: '#e60012',
        }
      }
    },
  },
  plugins: [],
}
