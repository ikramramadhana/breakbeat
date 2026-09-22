/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#121212",
          deep: "#0A0A0A",
          panel: "#181818",
          elevated: "#282828",
          line: "#2A2A2A",
        },
        brand: {
          DEFAULT: "#1DB954",
          soft: "#1ED760",
          dim: "#169C46",
        },
        ink: {
          primary: "#FFFFFF",
          muted: "#B3B3B3",
          faint: "#727272",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.55" },
          "50%": { transform: "scale(1.08)", opacity: "0.9" },
        },
        drift: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" },
        },
        equalize: {
          "0%, 100%": { height: "20%" },
          "50%": { height: "100%" },
        },
      },
      animation: {
        breathe: "breathe 4.5s ease-in-out infinite",
        drift: "drift 6s ease-in-out infinite",
        equalize: "equalize 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};