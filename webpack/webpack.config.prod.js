const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sharedConfig = require('./webpack.config.shared.js');

const config = Object.assign({}, sharedConfig);

config.output.path = `${__dirname}/../public`;
config.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        'process.env.TRAVIS': JSON.stringify(process.env.TRAVIS),
        'process.env.TRAVIS_SECURE_ENV_VARS': JSON.stringify(process.env.TRAVIS_SECURE_ENV_VARS),
        'process.env.TRAVIS_PULL_REQUEST': JSON.stringify(process.env.TRAVIS_PULL_REQUEST),
        'process.env.QUANDL_API_KEY': JSON.stringify(process.env.QUANDL_API_KEY),
        'process.env.QUANDL_KEY': JSON.stringify(process.env.QUANDL_KEY)
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
