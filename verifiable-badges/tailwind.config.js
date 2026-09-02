/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1320",
        panel: "#181E33",
        panel2: "#1F2743",
        parchment: "#EDE6D3",
        parchment2: "#E3DAC0",
        brass: "#C9A227",
        brassLight: "#E4C15C",
        mint: "#4FD1AE",
        rust: "#B5563B",
        inktext: "#EAE7DC",
        muted: "#9AA0B4",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
