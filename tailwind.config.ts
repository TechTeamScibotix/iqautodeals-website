import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enterprise professional theme
        primary: "#2563eb",      // Blue 600 - vibrant professional blue
        "primary-dark": "#1d4ed8", // Blue 700 for hover
        "primary-light": "#3b82f6", // Blue 500 for accents
        secondary: "#1e293b",    // Slate 800
        "secondary-light": "#334155", // Slate 700
        accent: "#059669",       // Emerald 600 - sophisticated green
        "accent-light": "#10b981", // Emerald 500
        dark: "#1e293b",         // Slate 800 - professional dark
        "dark-light": "#334155", // Slate 700
        light: "#f8fafc",        // Slate 50 - clean white
        "light-dark": "#f1f5f9", // Slate 100
        "text-primary": "#0f172a",   // Slate 900
        "text-secondary": "#334155", // Slate 700
        "text-muted": "#64748b",     // Slate 500
        "text-light": "#94a3b8",     // Slate 400
        error: "#dc2626",        // Red 600
        success: "#059669",      // Emerald 600
        warning: "#d97706",      // Amber 600
        border: "#e2e8f0",       // Slate 200
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
