const testWebpackConfig = require('./webpack.test');


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
        coverageReporter: {
            dir: 'coverage/',
            reporters: [{ type: 'text' }],
        },

        browsers: ['ChromeHeadless', 'PhantomJS'],
    });
};
