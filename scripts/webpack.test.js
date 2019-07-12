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

module.exports = (context, env = {}) => common(env, () => new TestWebpackConfigBuilder())
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
            nodeEnv: 'test',
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
                        'ignore-loader',
                    ],
                },
                {
                    test: /\.(s?css|png|svg|jpe?g|gif|svg|webp|woff2?|eot|ttf|otf)$/,
                    use: 'ignore-loader',
                },
            ],
        },
    });
