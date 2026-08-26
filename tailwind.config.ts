import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 50: "#f2f7fb", 600: "#174a73", 700: "#123a5b", 900: "#09233b" },
        steel: {
          50: "#f7fafc",
          100: "#edf2f7",
          200: "#e2e8f0",
          500: "#64748b",
          700: "#334155"
        }
      },
      boxShadow: {
        card: "0 1px 2px rgb(15 23 42 / 0.05), 0 4px 12px rgb(15 23 42 / 0.04)"
      }
    }
  },
  plugins: []
};

export default config;
