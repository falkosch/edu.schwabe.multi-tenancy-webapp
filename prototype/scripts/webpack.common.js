const _ = require('lodash');
const { ContextReplacementPlugin, DefinePlugin } = require('webpack');
const WebpackConfigBuilder = require('./webpack-config-builder');
const projectPackage = require('../package.json');

const { language } = projectPackage['edu.schwabe.webapp-prototypes'];

const [firstLanguage, ...restLanguages] = language.availableLanguages;

function defaultBuilderFactory() {
    return new WebpackConfigBuilder();
}

module.exports = (env = {}, builderFactory = defaultBuilderFactory) => builderFactory()
    .withTenant(env.tenant)
    .addEntry('@babel/polyfill')
    .addHtmlWebpackPluginConfig({
        template: './src/index.html',
    })
    .addConfig({
        output: {
            hashSalt: '8007831555',
        },
        node: {
            __filename: true,
            __dirname: true,
        },
        plugins: [
            new DefinePlugin({
                __VERSION__: JSON.stringify(projectPackage.version),
            }),
            new ContextReplacementPlugin(
                /moment[/\\]locale$/,
                // /de|en/,
                new RegExp(
                    _.reduce(
                        restLanguages,
                        (languageExpression, currentRestLanguage) => `${languageExpression}|${currentRestLanguage}`,
                        firstLanguage,
                    ),
                ),
            ),
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                cacheCompression: false,
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.js'],
        },
    });
