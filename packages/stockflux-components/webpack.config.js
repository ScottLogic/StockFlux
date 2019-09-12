const path = require('path');

module.exports = {
    mode: 'production',
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
            },
            {
                test: /\.svg$/,
                use: [
                  {
                    loader: "babel-loader"
                  },
                  {
                    loader: "react-svg-loader",
                    options: {
                      jsx: true // true outputs JSX tags
                    }
                  }
                ]
            }
        ],
    },
    externals: {
        react: 'react',
        'openfin-react-hooks': 'openfin-react-hooks',
        'openfin-layouts': 'openfin-layouts',
        "date-fns": "date-fns",
        "openfin-fdc3": "openfin-fdc3"
    }
};
