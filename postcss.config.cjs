module.exports = {
  plugins: [
    require('@tailwindcss/postcss')('./tailwind.config.js'),
    require('autoprefixer'),
  ]
}
