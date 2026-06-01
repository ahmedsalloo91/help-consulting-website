import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#071B3A",
        royal: "#1557D6",
        skyline: "#EAF1FF",
        graphite: "#24324B"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(7, 27, 58, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
