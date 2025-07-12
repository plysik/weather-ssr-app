/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}', 
    './node_modules/@shadcn/ui/dist/**/*.js'
  ],
  safelist: [
    'bg-white',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};