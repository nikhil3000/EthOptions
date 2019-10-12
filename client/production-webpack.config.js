const path = require('path');
require("@babel/polyfill");
const TerserPlugin = require('terser-webpack-plugin');

// var BrotliPlugin = require('brotli-webpack-plugin')
var webpack = require('webpack');
module.exports = {
    entry: ['@babel/polyfill', './src/app.js'],
    output: {
        path: path.join(__dirname, '/public'),
        filename: '[name].bundle.js'
    },
    plugins: [
        // 	new BrotliPlugin({
        // 		asset: '[path].br[query]',
        // 		test: /\.(js|css|html|svg)$/,
        // 		threshold: 10240,
        // 		minRatio: 0.8
        // 	})
        // new webpack.optimize.UglifyJsPlugin(), //minify everything
        new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
    ],
    optimization: {
        minimizer: [new TerserPlugin()],
      },
    // optimization: {
    //     minimizer: [
    //         new TerserPlugin({
    //             cache: true,
    //             parallel: true,
    //             sourceMap: true, // Must be set to true if using source-maps in production
    //             terserOptions: {
    //                 // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
    //             }
    //         }),
    //     ],
    // },
    node: { fs: 'empty' },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        }, {
            test: /\.s?css$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, '/public'),
        historyApiFallback: true
    }

};