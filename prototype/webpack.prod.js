const path = require('path');

const merge = require('webpack-merge');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { HashedModuleIdsPlugin } = require('webpack');

const common = require('./webpack.common');

module.exports = merge(
    common,
    {
        mode: 'production',
        output: {
            chunkFilename: '[name].[hash].chunk.js',
            filename: '[name].[hash].bundle.js',
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new FaviconsWebpackPlugin({
                logo: './src/assets/favicon.png',
                icons: {
                    appleStartup: false,
                    windows: true,
                },
            }),
            new HashedModuleIdsPlugin(),
            new MiniCssExtractPlugin({
                chunkFilename: '[name].[hash].chunk.css',
                filename: '[name].[hash].bundle.css',
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.template\.html?$/,
                    use: [
                        {
                            loader: 'ngtemplate-loader',
                            options: {
                                relativeTo: path.resolve(__dirname, './src'),
                                requireAngular: true,
                            },
                        },
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
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: { importLoaders: 1 },
                        },
                        'postcss-loader',
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: { importLoaders: 1 },
                        },
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/,
                    use: ['file-loader'],
                },
            ],
        },
    },
);
