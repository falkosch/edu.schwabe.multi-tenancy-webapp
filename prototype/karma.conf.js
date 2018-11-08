const webpackConfig = require('./webpack.dev');

module.exports = (config) => {
    const testSuite = './src/app.karma.js';

    config.set({
        frameworks: ['jasmine'],
        files: [testSuite],
        preprocessors: {
            [testSuite]: ['webpack', 'sourcemap'],
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'minimal',
        },

        reporters: [
            'spec',
            'coverage',
            'summary',
        ],
        coverageReporter: {
            dir: 'coverage/',
            reporters: [{ type: 'text' }],
        },

        browsers: ['ChromeHeadless', 'PhantomJS'],
    });
};
