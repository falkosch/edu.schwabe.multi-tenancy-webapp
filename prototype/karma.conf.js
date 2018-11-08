const webpackConfig = require('./webpack.dev');

module.exports = (config) => {
    const srcSuite = './src/app.module.js';
    const testSuite = './src/app.karma.js';

    config.set({
        frameworks: ['mocha', 'chai'],
        files: [srcSuite, testSuite],
        preprocessors: {
            [srcSuite]: ['webpack', 'sourcemap', 'coverage'],
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
            reporters: [{ type: 'html' }, { type: 'text' }],
        },

        browsers: ['ChromeHeadless'],
    });
};
