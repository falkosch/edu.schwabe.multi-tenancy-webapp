const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');

const common = require('./scripts/webpack.common');

const projectPackage = require('./package.json');

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
                cache: true,
                logo: './src/assets/favicon.png',
                favicons: {
                    appShortName: projectPackage[projectPackage.name].shortName,
                },
            }),
            new ImageminPlugin({}),
            new MiniCssExtractPlugin({
                chunkFilename: '[name].[hash].chunk.css',
                filename: '[name].[hash].bundle.css',
            }),
        ],
        optimization: {
            mangleWasmImports: true,
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
                    test: /\.(woff2?|eot|ttf|otf)$/,
                    use: [
                        'file-loader',
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|webp)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                            },
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                // https://github.com/tcoopman/image-webpack-loader
                                mozjpeg: {
                                    // https://github.com/imagemin/imagemin-mozjpeg#options
                                },
                                optipng: {
                                    // https://github.com/imagemin/imagemin-optipng#options
                                },
                                gifsicle: {
                                    // https://github.com/imagemin/imagemin-gifsicle
                                },
                                webp: {
                                    // https://github.com/imagemin/imagemin-webp
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    use: [
                        'file-loader',
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                // https://github.com/tcoopman/image-webpack-loader
                                svgo: {
                                    // https://github.com/imagemin/imagemin-svgo#options
                                },
                            },
                        },
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
