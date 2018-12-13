const path = require('path');

const { HotModuleReplacementPlugin } = require('webpack');

const common = require('./webpack.common');

module.exports = env => common(env)
    .addConfig({
        mode: 'development',
        devtool: 'inline-source-map',
        output: {
            chunkFilename: '[name].chunk.js',
            filename: '[name].bundle.js',
        },
        devServer: {
            historyApiFallback: true,
            hot: true,
        },
        plugins: [
            new HotModuleReplacementPlugin(),
        ],
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    scss: {
                        test: /\.s?css/,
                    },
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
                        'html-loader',
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        'resolve-url-loader',
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        'resolve-url-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
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
    .build();
