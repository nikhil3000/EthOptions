const path = require('path');
require("@babel/polyfill");

module.exports = {
    entry: ['@babel/polyfill','./src/app.js'],
    output: {
        path: path.join(__dirname,'/public'),
        filename: 'bundle.js'
    },
    module: {
        rules : [{
            loader:'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        }, {
            test:/\.s?css$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        },{
            test: /\.(jpe?g|png|gif|mp3)$/i,
            loaders: ['file-loader']
        }]
    },
    node: { fs: 'empty' },
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.join(__dirname,'/public'),
        historyApiFallback: true
    }

};