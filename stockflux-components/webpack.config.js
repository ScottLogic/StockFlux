const path = require('path');

module.exports = {
    mode: 'development', // TODO: production mode
    entry: path.resolve('src', 'index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'stockflux-components',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
              test: /\.jsx?$/,
              include: [
                  path.resolve(__dirname, 'src')
              ],
              enforce: 'pre',
              use: [
                  { loader: 'eslint-loader' }
              ],
            },
            {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: [
                    { loader: 'babel-loader' }
                ]
            },
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.png$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: [
                    { loader: 'url-loader' }
                ]
            }
        ],
    },
    externals: {
        react: 'react',
        'openfin-react-hooks': 'openfin-react-hooks',
        'openfin-layouts': 'openfin-layouts',
    }
};
