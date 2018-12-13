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
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ['babel-loader'],
                },
            ],
        },
    });
