import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-dm-sans)', '"DM Sans"', 'Arial', 'Helvetica', 'sans-serif'],
    },
    extend: {
      colors: {
        // TrueCar-inspired theme
        primary: "#1979c7",      // TrueCar blue
        "primary-dark": "#0e68ac", // Darker blue for hover
        "primary-light": "#109de7", // Lighter blue
        secondary: "#343434",    // TrueCar dark gray
        "secondary-light": "#707070", // Medium gray
        accent: "#06aeaa",       // TrueCar teal
        "accent-light": "#058b88", // Darker teal
        "accent-orange": "#ff6400", // TrueCar orange
        "accent-orange-dark": "#cb4f00", // Darker orange
        dark: "#343434",         // TrueCar dark text
        "dark-light": "#707070", // Medium gray
        light: "#ffffff",        // White
        "light-dark": "#f2f2f2", // Light gray background
        "light-darker": "#f8f8f8", // Slightly darker
        "text-primary": "#343434",   // TrueCar dark text
        "text-secondary": "#707070", // Medium gray
        "text-muted": "#969696",     // Muted/disabled text
        "text-light": "#707070",     // Light text
        error: "#f04124",        // TrueCar red
        success: "#03806d",      // TrueCar green
        warning: "#fbbe00",      // TrueCar yellow
        border: "#e5e5e5",       // TrueCar border
        "focus-blue": "#0098d1", // TrueCar focus/active cyan
      },
      borderRadius: {
        'pill': '20em',          // TrueCar pill buttons
        'card': '0.3125rem',     // TrueCar card radius (5px)
      },
      boxShadow: {
        'card': '.125rem .125rem .4375rem 0 rgba(1,1,1,.15)', // TrueCar card shadow
        'card-hover': '.125rem .125rem .625rem 0 rgba(1,1,1,.25)', // Hover shadow
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 4s linear infinite',
        'border-beam': 'borderBeam 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        borderBeam: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
