const WebpackConfigBuilder = require('./webpack-config-builder');

function defaultBuilderFactory() {
    return new WebpackConfigBuilder();
}

const BABEL_LOADER = {
    loader: 'babel-loader',
    options: {
        cacheDirectory: true,
        cacheCompression: false,
        rootMode: 'upward',
    },
};

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
                        BABEL_LOADER,
                    ],
                },
                {
                    test: /\.ts$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: [
                        BABEL_LOADER,
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                compilerOptions: {
                                    noEmit: false,
                                },
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
    });
