const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
        options: {
          svgoConfig: {
            plugins: [{ removeViewBox: false }],
          },
          jsx: true,
          throwIfNamespace: false,
        },
      },
    ],
  },
}
