import type { Config } from "tailwindcss";

/**
 * SLOW WORLD DESIGN SYSTEM - Tailwind Configuration
 * 
 * Shared by: Riad di Siena, Slow Morocco, Slow Namibia,
 *            Slow Türkiye, Slow Tunisia, Slow Mauritius
 * 
 * Last updated: December 24, 2025
 */

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ═══════════════════════════════════════════════════════════
         COLORS
         All colors use CSS variables for consistency
         ═══════════════════════════════════════════════════════════ */
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        sand: "hsl(var(--sand))",
        "footer-background": "hsl(var(--footer-background))",
        "footer-foreground": "hsl(var(--footer-foreground))",
      },

      /* ═══════════════════════════════════════════════════════════
         TYPOGRAPHY
         ═══════════════════════════════════════════════════════════ */
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },

      /* ═══════════════════════════════════════════════════════════
         SPACING
         ═══════════════════════════════════════════════════════════ */
      spacing: {
        section: "clamp(80px, 12vh, 120px)",
        "section-sm": "clamp(48px, 8vh, 80px)",
      },

      /* ═══════════════════════════════════════════════════════════
         MAX WIDTHS
         ═══════════════════════════════════════════════════════════ */
      maxWidth: {
        content: "680px",
        wide: "1200px",
      },

      /* ═══════════════════════════════════════════════════════════
         BORDER RADIUS
         ═══════════════════════════════════════════════════════════ */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
