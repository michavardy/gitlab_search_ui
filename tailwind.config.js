/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'turq': 'rgba(0, 152, 151, 100)',
        'turq_hover': 'rgba(0, 152, 151, 50)',
      },
    },
  },
  plugins: [],
}
