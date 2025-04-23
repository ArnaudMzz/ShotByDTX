/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // active le dark mode toggle
  theme: {
    extend: {
      colors: {
        primary: "#449DD1",
        background: "#f8f9fa",
        text: "#1a1a1a",
      },
    },
  },
  plugins: [],
};

