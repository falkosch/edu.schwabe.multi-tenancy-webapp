const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');

const common = require('./scripts/webpack.common');

process.env.NODE_ENV = 'production';

module.exports = env => common(env)
    .withContext(__dirname)
    .withBundleAnalyzer()
    .addConfig({
        mode: 'production',
        output: {
            chunkFilename: '[name].[hash].chunk.js',
            filename: '[name].[hash].bundle.js',
        },
        plugins: [
            new CleanWebpackPlugin([
                'dist',
                'deploy',
            ]),
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
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                }),
            ],
            runtimeChunk: {
                name: 'main',
            },
            splitChunks: {
                chunks: 'all',
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
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            },
                        },
                        'postcss-loader',
                        'resolve-url-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true, // required for resolve-url-loader, do not omit!
                                sourceMapContents: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/,
                    use: [
                        'file-loader',
                    ],
                },
            ],
        },
    })
    .build({
        plugins: [
            new CompressionPlugin(),
            new FileManagerPlugin({
                onEnd: {
                    mkdir: [
                        './deploy',
                    ],
                    archive: [
                        { source: './dist', destination: './deploy/prototype.zip' },
                    ],
                },
            }),
        ],
    });
