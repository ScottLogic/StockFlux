const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sharedConfig = require('./webpack.config.shared.js');

const config = Object.assign({}, sharedConfig, {
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './public',
        hot: true,
        port: 5000,
        stats: {
            chunks: false
        }
    }
});

config.output.publicPath = '/';
config.entry.child.push('webpack-dev-server/client?http://localhost:5000', 'webpack/hot/only-dev-server');
config.entry.parent.push('webpack-dev-server/client?http://localhost:5000', 'webpack/hot/only-dev-server');
config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
    }),
    new CopyWebpackPlugin([
        { from: 'src/static' },
        { from: 'openfin-config/app.dev.json', to: './app.json' }
    ])
);

module.exports = config;
