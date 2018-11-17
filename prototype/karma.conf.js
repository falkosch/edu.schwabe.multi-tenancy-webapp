const _ = require('lodash');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

const webpackConfig = require('./webpack.dev');

const testWebpackConfig = _.assign(
    {},
    webpackConfig,
    {
        devServer: _.mapValues(webpackConfig.devServer, (value, key) => {

            if (key === 'hot') {
                return false;
            }

            return value;
        }),
        plugins: _.reject(webpackConfig.plugins, (plugin) => {
            const blacklistedPlugins = [
                FaviconsWebpackPlugin,
                HotModuleReplacementPlugin,
            ];

            return _.some(blacklistedPlugins, pluginType => plugin instanceof pluginType);
        }),
        module: {
            rules: _.map(webpackConfig.module.rules, (rule) => {
                const { test } = rule;
                const whitelist = [
                    '.js',
                    '.template.html',
                ];
                const ruleIsWhitelisted = _.some(whitelist, v => test.test(v));
                if (ruleIsWhitelisted) {
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
