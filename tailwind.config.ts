import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e87f93", // Pink - ורוד עז ואנרגטי
          light: "#fce4e9",   // Pink בהיר מאוד
          dark: "#d5617a",    // Pink כהה יותר
        },
        accent: {
          DEFAULT: "#FF6B6B", // Coral - חם ואנרגטי
          light: "#FFE5E5",   // Coral בהיר
          dark: "#E55555",    // Coral כהה
        },
        secondary: {
          DEFAULT: "#fce4e9", // Pink Light - לקופסאות ורקעים
          light: "#fef3f6",   // Pink בהיר מאוד
          dark: "#e87f93",    // Pink בינוני
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-assistant)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-rtl")],
};

export default config;
