const path = require('path');
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
        optimization: {
            splitChunks: {
                cacheGroups: {
                    scss: {
                        test: /\.s?css/,
                        name: 'scss',
                        chunks: 'all',
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
                            options: { sourceMap: true },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true },
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true },
                        },
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
