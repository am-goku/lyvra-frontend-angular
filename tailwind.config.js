/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts, css, scss}"],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Indigo for buttons/CTAs
        accent: '#8b5cf6', // Violet for highlights
        neutral: '#f9fafb', // Light gray for backgrounds
        text: '#1f2937', // Dark gray for text
      },
    },
  },
  plugins: []
};
