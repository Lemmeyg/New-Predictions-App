/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0C0F",
        foreground: "#FFFFFF",
        primary: "#FFB800",
        panel: "#1A1F2A",
        border: "#2D3748"
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 