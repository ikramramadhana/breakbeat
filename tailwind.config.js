/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          deep: "#0B0F1A",
          mid: "#141B2E",
          panel: "#1A2338",
          line: "#252E45",
        },
        glow: {
          DEFAULT: "#E8B975",
          soft: "#F2CC94",
          dim: "#8A6A3F",
        },
        dusk: {
          DEFAULT: "#5B7A9D",
          soft: "#7C97B5",
        },
        ink: {
          primary: "#F0EDE6",
          muted: "#8B93A7",
          faint: "#5A6278",
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
      },
      animation: {
        breathe: "breathe 4.5s ease-in-out infinite",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
