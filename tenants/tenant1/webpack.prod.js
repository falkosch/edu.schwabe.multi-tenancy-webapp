const CompressionPlugin = require('compression-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');

const common = require('./scripts/webpack.common');
const packageProperties = require('./package.json');

process.env.NODE_ENV = 'production';

module.exports = (env = {}) => common(env)
    .withContext(__dirname)
    .withPackageProperties(packageProperties)
    .withBundleAnalyzer(!env.noBundleAnalyzer)
    .addHtmlWebpackPluginConfig({
        minify: {
            // https://github.com/kangax/html-minifier#options-quick-reference
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
        },
    })
    .addConfig({
        mode: 'production',
        output: {
            chunkFilename: '[name].[hash].chunk.js',
            filename: '[name].[hash].bundle.js',
        },
        plugins: [
            new HashedModuleIdsPlugin(),
            new WebappWebpackPlugin({
                cache: true,
                logo: './src/assets/favicon.png',
                favicons: {
                    appShortName: packageProperties[packageProperties.name].shortName,
                },
            }),
            new ImageminPlugin({
                // https://github.com/Klathmon/imagemin-webpack-plugin#api
                optipng: {
                    optimizationLevel: 1,
                },
            }),
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
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            warnings: true,
                        },
                    },
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
                                relativeTo: 'src',
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
                        '../../tools/minify-json-loader.js',
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
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                sourceMap: true,
                                sourceMapContents: false,
                                resources: [
                                    'src/scss/shared/**/*.scss',
                                ],
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
                                    optimizationLevel: 1,
                                },
                                pngquant: {
                                    // https://github.com/imagemin/imagemin-pngquant#options
                                    speed: 10,
                                },
                                gifsicle: {
                                    // https://github.com/imagemin/imagemin-gifsicle#options
                                },
                                svgo: {
                                    // https://github.com/imagemin/imagemin-svgo#options
                                },
                                webp: {
                                    // https://github.com/imagemin/imagemin-webp#options
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
            new CompressionPlugin({
                cache: true,
                compressionOptions: {
                    // https://nodejs.org/api/zlib.html#zlib_class_options
                    level: 1, // compression with best speed
                },
            }),
            new FileManagerPlugin({
                onStart: {
                    delete: ['dist', 'deploy'],
                },
                onEnd: {
                    mkdir: [
                        './deploy',
                    ],
                    archive: [{
                        source: './dist',
                        destination: './deploy/prototype.zip',
                        options: {
                            zlib: {
                                level: 1,
                            },
                        },
                    }],
                },
            }),
        ],
    });
