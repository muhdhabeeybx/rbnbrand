/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        sans: ["Onest", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
    },
  },
  plugins: [],
}
