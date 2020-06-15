/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  theme: {
    numbers: {
      1: '1',
      2: '2',
      3: '3'
    },
    extend: {
      gridColumnEnd: (theme, { negative }) => negative(theme('numbers')),
      gridColumnStart: (theme, { negative }) => negative(theme('numbers'))
    }
  },
  variants: {},
  plugins: []
}
