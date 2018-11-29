module.exports = {
    entry: {
        child: ['babel-polyfill', './src/child/index.js'],
        parent: ['babel-polyfill', './src/parent/parent.js'],
        analytics: ['./src/parent/analytics/analytics.js']
    },
    output: {
        filename: './[name]_bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules(?!(\/|\\)openfin-layouts)/, loader: 'babel-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
            { test: /\.svg$/, loader: 'file-loader' },
            { test: /\.eot$/, loader: 'file-loader' },
            { test: /\.ttf$/, loader: 'file-loader' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: []
};
