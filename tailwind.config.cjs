/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all files recursively in the src directory
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        rm: ['"Rammetto One"','serif'],
      },
      gridTemplateAreas: {
        layout: [
          "header header header",
          "sidebar main right-sidebar",
          "footer footer footer",
        ],
      },
      gridTemplateColumns: {
        layout: "1fr 3fr 1.5fr", // Sidebar, Main Content, Right Sidebar
      },
      gridTemplateRows: {
        layout: "auto 1fr auto", // Header, Main Content, Footer
      },
      colors: {
        dc: "#5865f2",
        bl: "#0E26D9",
        bl1: "#161cbb",
        bl2: "#250070",
        burble: "#4207b9",
        dark: "#313338",
        darker: "#2b2d31",
        darkest: "#1e1f22",
        acc1: "#128bc9",
        grn: "#23a55a",
        lighter: "#9d9ea4",
        light: "#3f4147",
        dcGrn: "#2ecc71",
        dcGrn1: "#1f8b4c",
        dcDrkGrn: "#1abc9c",
        dcDrkGrn1: "#11806a",
        dcBl: "#3498db",
        dcBl1: "#206694",
        dcPpl: "#9b59b6",
        dcPpl1: "#71368a",
        dcPnk: "#e91e63",
        dcPnk1: "#ad1457",
        dcOrn: "#e74c3c",
        dcOrn1: "#992d22",
        bgHover: "#2e3035",
      },
    },
  },
  plugins: [require('daisyui')], // Add DaisyUI plugin
};


