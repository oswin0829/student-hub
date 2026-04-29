import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        // These match the variables we're putting in globals.css
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        card: "var(--card)",
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 30px 60px -15px rgba(0, 0, 0, 0.1)',
        'premium-dark': '0 20px 40px -15px rgba(255, 255, 255, 0.02)',
        'premium-dark-hover': '0 30px 60px -15px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;