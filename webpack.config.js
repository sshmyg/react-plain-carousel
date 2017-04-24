'use strict';

let path = require('path');
let webpack = require('webpack');

let jsCWD = path.join(__dirname, './src');
let isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    context: jsCWD,
    cache: true,
    devtool: isDev ? 'cheap-inline-module-sourcemap' : 'hidden',

    watchOptions: {
        aggregateTimeout: 100
    },

    entry: {
        'react-simple-carousel': './index',
        'demo': '../demo/index'
    },

    output: {
        path: path.join(__dirname, 'dist/'),
        filename: '[name].js',
        publicPath: '/dist/',
    },

    resolve: {
        modules: [path.join(jsCWD), 'node_modules'],
        extensions: ['.js', '.jsx'],
    },

    stats: {
        warnings: false
    },

    module: {
        rules: [
            //Babel settings
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new webpack.NoEmitOnErrorsPlugin()
    ],

    devServer: {
        contentBase: path.join(__dirname, 'demo'),
        historyApiFallback: true,
        open: true
    }
};

if (!isDev) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
}
