/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        gray1: "#333333",
        gray2: "#4F4F4F",
        gray3: "#828282",
        gray4: "#BDBDBD",
        gray5: "#E0E0E0",
        gray6: "#F2F2F2",
      },
    },
  },
  plugins: [],
};
