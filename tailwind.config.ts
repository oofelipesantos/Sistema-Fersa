import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f2f7fb",
          100: "#e1ecf5",
          200: "#c3d7e8",
          600: "#174a73",
          700: "#123a5b",
          800: "#0d2d49",
          900: "#09233b",
          950: "#051627"
        },
        accent: {
          50: "#eef7fd",
          100: "#d6ecfa",
          400: "#5cb3ea",
          500: "#2b93d6",
          600: "#1a74b0"
        },
        steel: {
          50: "#f7fafc",
          100: "#edf2f7",
          200: "#e2e8f0",
          500: "#64748b",
          700: "#334155"
        }
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "spin-slow": "spin 40s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both"
      },
      boxShadow: {
        card: "0 1px 2px rgb(15 23 42 / 0.05), 0 4px 12px rgb(15 23 42 / 0.04)",
        lift: "0 12px 32px -12px rgb(9 35 59 / 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
