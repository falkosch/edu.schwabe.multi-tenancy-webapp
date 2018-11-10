const merge = require('webpack-merge');
const { HotModuleReplacementPlugin } = require('webpack');

const common = require('./webpack.common');

module.exports = merge(
    common,
    {
        mode: 'development',
        devtool: 'inline-source-map',
        output: {
            chunkFilename: '[name].chunk.js',
            filename: '[name].bundle.js',
        },
        devServer: {
            historyApiFallback: true,
            contentBase: './dist',
            hot: true,
        },
        plugins: [
            new HotModuleReplacementPlugin(),
        ],
    },
);
