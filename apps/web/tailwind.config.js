/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/lib/**/*.{js,ts}",
    "../../packages/ui/index.ts"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Flinki brand colors (from reference designs)
        "primary-brand": "#8563EB",
        "accent-blue": "#3b82f6",
        "accent-green": "#22c55e",
        "background-light": "#f6f6f8",
        "background-dark": "#1E1145",
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        slideUp: {
          from: { transform: "translateY(100%)" },
          to:   { transform: "translateY(0)" },
        },
        tabContentIn: {
          from: { opacity: "0", transform: "translateY(2rem)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up":    "slideUp 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        "tab-content": "tabContentIn 300ms ease-out",
      },
      transitionTimingFunction: {
        // iOS-style deceleration curve — used for all slide panels
        panel: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      transitionDelay: {
        // Backdrop on close: slight delay so the panel visually clears first
        "backdrop-out": "40ms",
      },
      // ---------------------------------------------------------------------------
      // Z-index tokens — use these instead of raw numbers so layers never clash.
      //
      //  sidebar        20   left nav rail / mobile bottom bar
      //  dropdown       30   contextual menus, inline popovers
      //  backdrop       40   modal scrim layers
      //  modal          50   standard bottom-sheet / dialog panels
      //  modal-elevated 60   panels that sit above their own separate scrim
      //  viewer        100   full-screen media (image / story viewer)
      //  overlay       200   highest-priority dialogs (credential detail, etc.)
      // ---------------------------------------------------------------------------
      zIndex: {
        sidebar:         '20',
        dropdown:        '30',
        backdrop:        '40',
        modal:           '50',
        'modal-elevated': '60',
        viewer:          '100',
        overlay:         '200',
      },
    },
  },
  plugins: [],
}
