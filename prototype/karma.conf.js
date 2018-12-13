const merge = require('webpack-merge');

const KarmaConfigBuilder = require('./scripts/karma-config-builder');

const testWebpackConfigBuilderFactory = require('./scripts/webpack.test');

process.env.NODE_ENV = 'test';

module.exports = (config) => {

    // pass env.* args in "karma start -- --env.*=?" and process.env into an env-object
    // so that f.e. tenant parameters are easily retrievable

    const testEnv = merge(
        process.env,
        config.env,
    );

    config.set(
        new KarmaConfigBuilder()
            .withPreprocessors('webpack', 'sourcemap')
            .withTenant(testEnv.tenant)
            .withWebpackConfig(
                testWebpackConfigBuilderFactory(testEnv, __dirname)
                    .build(),
            )
            .addConfig({
                browsers: [
                    'ChromeHeadless',
                    'PhantomJS',
                ],
                coverageReporter: {
                    dir: 'coverage/',
                    reporters: [
                        { type: 'text' },
                        { type: 'lcov' },
                    ],
                },
                frameworks: [
                    'jasmine',
                ],
                reporters: [
                    'spec',
                    'coverage',
                    'summary',
                ],
                specReporter: {
                    suppressPassed: true,
                },
                webpackMiddleware: {
                    stats: 'minimal',
                },
            })
            .build(),
    );
};
