/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        canvas: "var(--canvas)",
        ink: "var(--ink)",
        graphite: "var(--graphite)",
        pencil: "var(--pencil)",
        rule: "var(--rule)",
        accent: "var(--accent)",
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        serif: ['"Newsreader"', "ui-serif", "Georgia", "serif"],
        hand: ['"Nothing You Could Do"', "cursive"],
      },
      boxShadow: {
        frame:
          "0 1px 1px rgba(30,26,20,0.14), 0 6px 10px -4px rgba(30,26,20,0.22), 0 26px 40px -18px rgba(30,26,20,0.35)",
        "frame-lift":
          "0 2px 2px rgba(30,26,20,0.12), 0 14px 20px -8px rgba(30,26,20,0.22), 0 44px 60px -24px rgba(30,26,20,0.38)",
        label: "0 1px 1px rgba(30,26,20,0.12), 0 4px 8px -3px rgba(30,26,20,0.18)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
