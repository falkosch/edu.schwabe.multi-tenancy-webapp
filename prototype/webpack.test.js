const path = require('path');
const merge = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge(
    common,
    {
        mode: 'development',
        devtool: 'cheap-module-eval-source-map',
        devServer: {
            historyApiFallback: true,
            contentBase: './dist',
        },
        output: {
            chunkFilename: '[name].chunk.js',
            filename: '[name].bundle.js',
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
                    use: 'ignore-loader',
                },
                {
                    test: /\.scss$/,
                    use: 'ignore-loader',
                },
                {
                    test: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/,
                    use: 'ignore-loader',
                },
            ],
        },
    },
);
