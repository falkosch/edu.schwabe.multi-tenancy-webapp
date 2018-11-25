const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => (
    {
        entry: {
            'babel-polyfill': '@babel/polyfill',
            index: './src/index.module.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
            }),
        ],
        optimization: {
            runtimeChunk: {
                name: 'vendors',
            },
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        chunks: 'all',
                        name: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ['babel-loader'],
                },
            ],
        },
    }
);
