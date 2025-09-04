/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Quét tất cả component
    "./public/index.html"           // Quét file gốc
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
