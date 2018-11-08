const webpackConfig = require('./webpack.dev');

module.exports = (config) => {
    const testSuite = './src/app.karma.js';

    config.set({
        frameworks: ['mocha', 'chai'],
        files: [testSuite],
        preprocessors: {
            [testSuite]: ['webpack', 'sourcemap'],
        },
        webpack: webpackConfig,
        webpackMiddleware: {},

        reporters: ['progress', 'mocha', 'coverage'],
        mochaReporter: {
            output: 'autowatch',
        },
        coverageReporter: {
            dir: 'coverage/',
            reporters: [{ type: 'text' }],
        },

        browsers: ['ChromeHeadless'],
    });
};
