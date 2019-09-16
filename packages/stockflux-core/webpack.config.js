const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve('src', 'index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'stockflux-core',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        enforce: 'pre',
        use: [{ loader: 'eslint-loader' }]
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        use: [{ loader: 'babel-loader' }]
      }
    ]
  },
  externals: {
    'date-fns': 'date-fns',
    react: 'react',
    throat: 'throat',
    'openfin-fdc3': 'openfin-fdc3'
  }
};
