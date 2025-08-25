import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'DM Serif Display'", "serif"],
        sans: ["Onest", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.05em", // for headings
      },
    },
  },
  plugins: [],
};

export default config;
