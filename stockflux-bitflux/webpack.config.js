const path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve('src', 'assets', 'js', 'bitflux.js'),
    output: {
        filename: 'bitflux.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'stockflux-bitflux',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                enforce: 'pre',
                use: [
                    { loader: 'eslint-loader' }
                ]
            },
            {
                test: /\.js$/,
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
                test: /\.svg$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: [
                    { loader: 'url-loader' }
                ]
            }
        ]
    },
    resolve: {
        symlinks: false
    },
};
