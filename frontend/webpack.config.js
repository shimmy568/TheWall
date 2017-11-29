var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractLess = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    context: path.join(__dirname, "src"),
    devtool: "source-map",
    entry: "./app/index.jsx",
    module: {
        loaders: [{
                test: /(\.js|\.jsx)$/,
                exclude: /(node_modules|dist)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader"
            },
            {
                test: /\.jpg$/,
                use: ["file-loader"]
            }, {
                test: /\.png$/,
                use: ["url-loader?mimetype=image/png"]
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            }
        ]
    },
    output: {
        path: __dirname + "/dist/",
        filename: "bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        extractLess
    ],
};

