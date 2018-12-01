const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');

const common = require('./webpack.common');

module.exports = env => common(env)
    .withBundleAnalyzer()
    .addConfig({
        mode: 'production',
        output: {
            chunkFilename: '[name].[hash].chunk.js',
            filename: '[name].[hash].bundle.js',
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new HashedModuleIdsPlugin(),
            new WebappWebpackPlugin({
                logo: './src/assets/favicon.png',
                favicons: {
                    icons: {
                        android: false,
                        appleIcon: false,
                        appleStartup: false,
                        coast: false,
                        favicons: true,
                        firefox: false,
                        windows: false,
                        yandex: false,
                    },
                },
            }),
            new MiniCssExtractPlugin({
                chunkFilename: '[name].[hash].chunk.css',
                filename: '[name].[hash].bundle.css',
            }),
        ],
        optimization: {
            runtimeChunk: {
                name: 'main',
            },
            splitChunks: {
                cacheGroups: {
                    vendors: false,
                },
            },
        },
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
    })
    .build({
        plugins: [
            new CompressionPlugin(),
        ],
    });
