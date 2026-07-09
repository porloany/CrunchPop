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
        cream: "#F7F3EE",
        chocolate: "#4A342C",
        caramel: "#B78946",
        coffee: "#7A5A45",
        warm: "#FFFDF8"
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(74, 52, 44, 0.10)",
        card: "0 16px 34px rgba(74, 52, 44, 0.08)",
        drawer: "-24px 0 80px rgba(74, 52, 44, 0.18)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        rise: "rise 650ms cubic-bezier(.2,.7,.2,1) both",
        fade: "fade 500ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
