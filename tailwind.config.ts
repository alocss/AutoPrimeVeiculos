import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#111111",
          600: "#555555",
          400: "#8a8a8a",
        },
        primary: {
          50: "#fdecec",
          100: "#fad0d0",
          300: "#e88585",
          500: "#D32F2F",
          600: "#b52424",
          700: "#8f1c1c",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f7f7f8",
          border: "#e7e7ea",
        },
        success: "#1e8e5a",
        warning: "#b5730a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,17,17,0.04), 0 8px 24px -12px rgba(17,17,17,0.18)",
        cardHover: "0 4px 10px rgba(17,17,17,0.06), 0 20px 40px -16px rgba(17,17,17,0.28)",
        fab: "0 10px 24px -6px rgba(30,142,90,0.55)",
      },
      borderRadius: {
        card: "14px",
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.6s linear infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
