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
          DEFAULT: "#00BFA6", // Teal - אנרגטי וספורטיבי
          light: "#E0F7F4",   // Teal בהיר
          dark: "#00897B",    // Teal כהה
        },
        accent: {
          DEFAULT: "#FF6B6B", // Coral - חם ואנרגטי
          light: "#FFE5E5",   // Coral בהיר
          dark: "#E55555",    // Coral כהה
        },
        secondary: {
          DEFAULT: "#E0F7F4", // Teal Light - לקופסאות (הוחלף מצבע ורוד)
          light: "#F0FBFA",   // Teal בהיר מאוד
          dark: "#B8EDE7",    // Teal בינוני
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
