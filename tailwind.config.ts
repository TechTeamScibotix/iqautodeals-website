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
        primary: "#1979c7",
        "primary-dark": "#0e68ac",
        "primary-light": "#109de7",
        secondary: "#343434",
        "secondary-light": "#707070",
        accent: "#06aeaa",
        "accent-light": "#058b88",
        "accent-orange": "#ff6400",
        "accent-orange-dark": "#cb4f00",
        dark: "#343434",
        "dark-light": "#707070",
        light: "#ffffff",
        "light-dark": "#f2f2f2",
        "light-darker": "#f8f8f8",
        "text-primary": "#343434",
        "text-secondary": "#707070",
        "text-muted": "#969696",
        "text-light": "#707070",
        error: "#f04124",
        success: "#03806d",
        warning: "#fbbe00",
        border: "#e5e5e5",
        "focus-blue": "#0098d1",
      },
      borderRadius: {
        'pill': '20em',
        'card': '0.3125rem',
      },
      boxShadow: {
        'card': '.125rem .125rem .4375rem 0 rgba(1,1,1,.15)',
        'card-hover': '.125rem .125rem .625rem 0 rgba(1,1,1,.25)',
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
