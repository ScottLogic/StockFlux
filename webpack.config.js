const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        child: ['webpack-dev-server/client?http://localhost:5000', 'webpack/hot/only-dev-server', './src/child/index.js'],
        parent: ['webpack-dev-server/client?http://localhost:5000', 'webpack/hot/only-dev-server', './src/parent/parent.js']
    },
    output: {
        path: `${__dirname}/public`,
        filename: './[name]_bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'react-hot!babel' },
            { test: /\.less$/, loader: 'style-loader?singleton!css-loader!less-loader' },
            { test: /\.css$/, loader: 'style-loader?singleton!css-loader' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
            { test: /\.svg$/, loader: 'file-loader' },
            { test: /\.eot$/, loader: 'file-loader' },
            { test: /\.ttf$/, loader: 'file-loader' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
    devServer: {
        contentBase: './public',
        hot: true,
        port: 5000
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
