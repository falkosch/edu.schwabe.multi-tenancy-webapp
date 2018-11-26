const path = require('path');

const common = require('./webpack.common');

module.exports = env => common(env)
    .addConfig({
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
                    test: /\.(s?css|png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/,
                    use: 'ignore-loader',
                },
            ],
        },
    })
    .build();
