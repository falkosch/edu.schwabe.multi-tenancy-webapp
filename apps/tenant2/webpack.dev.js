const { HotModuleReplacementPlugin, ProgressPlugin } = require('webpack');

const common = require('./scripts/webpack.common');
const packageProperties = require('./package.json');

process.env.NODE_ENV = 'develop';

module.exports = () => common()
    .withContext(__dirname)
    .withPackageProperties(packageProperties)
    .addConfig({
        mode: 'development',
        devtool: 'inline-source-map',
        output: {
            chunkFilename: '[name].chunk.js',
            filename: '[name].bundle.js',
            pathinfo: false,
        },
        devServer: {
            hot: true,
            stats: 'minimal',
        },
        plugins: [
            new ProgressPlugin(),
            new HotModuleReplacementPlugin(),
        ],
        optimization: {
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false,
        },
        module: {
            rules: [
                {
                    test: /\.template\.html?$/,
                    use: [
                        {
                            loader: 'ngtemplate-loader',
                            options: {
                                relativeTo: 'src',
                                requireAngular: true,
                            },
                        },
                        'html-loader',
                    ],
                },
                {
                    type: 'javascript/auto',
                    test: /[/\\]i18n[/\\]([A-Z]{2}|[a-z]{2})([-_]([A-Z]{2}|[a-z]{2}))?\.json$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
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
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                sourceMap: true,
                                resources: [
                                    'src/scss/shared/**/*.scss',
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|webp|svg|woff2?|eot|ttf|otf)$/,
                    use: [
                        'file-loader',
                    ],
                },
            ],
        },
    })
    .build();
