const { ContextReplacementPlugin } = require('webpack');
const WebpackConfigBuilder = require('./webpack-config-builder');

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
        plugins: [
            new ContextReplacementPlugin(
                /moment[/\\]locale$/,
                /de|en/,
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
