const testWebpackConfig = require('./webpack.test');

const { env } = process;
env.NODE_ENV = 'test';

module.exports = (config) => {
    config.set({
        frameworks: ['jasmine'],
        files: [
            './src/index.karma.js',
        ],
        preprocessors: {
            './src/index.karma.js': ['webpack', 'sourcemap'],
        },
        webpack: testWebpackConfig(env),
        webpackMiddleware: {
            stats: 'minimal',
        },

        reporters: [
            'spec',
            'coverage',
            'summary',
        ],
        specReporter: {
            suppressPassed: true,
        },
        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'text' },
                { type: 'lcov' },
            ],
        },

        browsers: ['ChromeHeadless', 'PhantomJS'],
    });
};
