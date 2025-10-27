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
          DEFAULT: "#f7d2d9", // Pink - ורוד פסטל רך ונשי
          light: "#fef0f2",   // Pink בהיר מאוד
          dark: "#e5b5be",    // Pink כהה יותר
        },
        accent: {
          DEFAULT: "#FF6B6B", // Coral - חם ואנרגטי
          light: "#FFE5E5",   // Coral בהיר
          dark: "#E55555",    // Coral כהה
        },
        secondary: {
          DEFAULT: "#fef0f2", // Pink Light - לקופסאות ורקעים
          light: "#fff8f9",   // Pink בהיר מאוד
          dark: "#f7d2d9",    // Pink בינוני
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
