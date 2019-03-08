const _ = require('lodash');
const { ContextReplacementPlugin, DefinePlugin } = require('webpack');

const WithTenantConfigBuilder = require('./with-tenant-config-builder');
const WebpackConfigBuilder = require('./webpack-config-builder');
const projectPackage = require('../package.json');

const { language } = projectPackage[projectPackage.name];

const [firstLanguage, ...restLanguages] = language.allAvailable;

function defaultBuilderFactory() {
    return new WebpackConfigBuilder();
}

module.exports = (env = {}, builderFactory = defaultBuilderFactory) => builderFactory()
    .withTenant(env.tenant)
    .withProgress(WithTenantConfigBuilder.isFalsy(env.noProgress))
    .addEntry('@babel/polyfill')
    .addEntry('default-passive-events')
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
                new RegExp(
                    _.reduce(
                        restLanguages,
                        (expression, nextLanguage) => `${expression}|${nextLanguage}`,
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
