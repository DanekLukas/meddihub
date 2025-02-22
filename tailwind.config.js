module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        red: "#F96C6C",
        pink: "#FFADAD",
        yellow: "#F6F2AB",
        green: "#00B671",
        brightGreen: "#1FFFAA",
        blue: "#0A93B6",
        cardBg: "#2594A8",
        dark: "#3C3C43", // text color
        darkBg: "#383838BF",
        darkBorder: "#4B4B4B",
        darkText: "#333333",
      },
      fontFamily: {
        nunito: [ 'Nunito-Bold', 'sans-serif' ]
      },
      fontWeight: {
        'light-prefered': 200, // Adding a custom font weight
      },
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
};
