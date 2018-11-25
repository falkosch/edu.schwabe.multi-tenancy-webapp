const _ = require('lodash');
const testWebpackConfig = require('./webpack.test');

module.exports = (config) => {
    const testSuite = [
        './src/index.karma.js',
    ];

    config.set({
        frameworks: ['jasmine'],
        files: testSuite,
        preprocessors: _.reduce(
            testSuite,
            (accPreprocessors, value) => {
                accPreprocessors[value] = ['webpack', 'sourcemap'];
                return accPreprocessors;
            },
            {},
        ),
        webpack: testWebpackConfig(),
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
