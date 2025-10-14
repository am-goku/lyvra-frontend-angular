/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts, css, scss}"],
  theme: {
    extend: {
      colors: {
        primary: '#f472b6', // Blush pink for buttons/CTAs
        accent: '#6ee7b7', // Sage green for highlights
        neutral: '#f9fafb', // Light gray for backgrounds
        text: '#1f2937', // Dark gray for text
      },
    },
  },
  plugins: []
};
