const WebpackConfigBuilder = require('./webpack-config-builder');

function defaultBuilderFactory() {
    return new WebpackConfigBuilder();
}

module.exports = (builderFactory = defaultBuilderFactory) => builderFactory()
    .addEntry('core-js/stable')
    .addEntry('regenerator-runtime/runtime')
    .addEntry('default-passive-events')
    .addConfig({
        output: {
            hashSalt: '8007831555',
        },
        node: {
            __filename: true,
            __dirname: true,
        },
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
                                rootMode: 'upward',
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
