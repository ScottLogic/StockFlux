const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sharedConfig = require('./webpack.config.shared.js');

const config = Object.assign({}, sharedConfig);

config.output.path = `${__dirname}/../public`;
config.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false
        }
    }),
    new CopyWebpackPlugin([
        { from: 'src/static' },
        { from: 'openfin-config/app.prod.json', to: './app.json' }
    ])
);

module.exports = config;
