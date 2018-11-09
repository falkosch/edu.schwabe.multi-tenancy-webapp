const path = require('path');
const { HashedModuleIdsPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    entry: {
        'babel-polyfill': '@babel/polyfill',
        app: './src/app.module.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new HashedModuleIdsPlugin(),
        new FaviconsWebpackPlugin({
            logo: './src/assets/favicon.png',
            icons: {
                appleStartup: false,
                windows: true,
            },
        }),
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
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
            {
                test: /\.template\.html?$/,
                use: [
                    'ngtemplate-loader?requireAngular',
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: ['file-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader'],
            },
        ],
    },
};
