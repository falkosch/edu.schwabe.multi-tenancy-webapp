const _ = require('lodash');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const webpackConfig = require('./webpack.dev');

const testWebpackConfig = _.assign(
    {},
    webpackConfig,
    {
        plugins: _.reject(webpackConfig.plugins, v => v instanceof FaviconsWebpackPlugin),
        module: {
            rules: _.map(webpackConfig.module.rules, (rule) => {
                const { test } = rule;
                if (test.test('.js') || test.test('.template.html')) {
                    return rule;
                }
                return _.assign({}, rule, { use: 'ignore-loader' });
            }),
        },
    },
);

module.exports = (config) => {
    const testSuite = './src/app.karma.js';

    config.set({
        frameworks: ['jasmine'],
        files: [testSuite],
        preprocessors: {
            [testSuite]: ['webpack', 'sourcemap'],
        },
        webpack: testWebpackConfig,
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
