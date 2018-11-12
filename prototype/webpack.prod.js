const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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
        ],
        module: {
            rules: [
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
            ],
        },
    },
);
