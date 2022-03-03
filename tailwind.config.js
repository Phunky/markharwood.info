/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  content: [
    './pages/**/*.{html,js,vue}',
    './components/**/*.{html,js,vue}',
    './layouts/**/*.{html,js,vue}'
  ],
  safelist: [
    {
      pattern: /text-(red|amber|emerald|violet|pink|teal|indigo)-(300|500|700)/
    }
  ],
  theme: {
    extend: {
    }
  },
  plugins: []
}
