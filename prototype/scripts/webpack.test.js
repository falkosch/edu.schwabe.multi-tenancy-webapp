const path = require('path');

const WebpackConfigBuilder = require('./webpack-config-builder');

const common = require('./webpack.common');

class TestWebpackConfigBuilder extends WebpackConfigBuilder {

    build(...appendConfigs) {
        const builtConfig = super.build(...appendConfigs);

        // karma-webpack must fill the entry-property
        builtConfig.entry = undefined;

        return builtConfig;
    }
}

module.exports = (env, context) => common(env, () => new TestWebpackConfigBuilder())
    .withContext(context)
    .withResourcesToOverride(null)
    .addConfig({
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            historyApiFallback: true,
        },
        output: {
            chunkFilename: '[name].chunk.js',
            filename: '[name].bundle.js',
            pathinfo: false,
        },
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
                                relativeTo: path.resolve(context, './src'),
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
    });
