const merge = require('webpack-merge');
const puppeteer = require('puppeteer');

const KarmaConfigBuilder = require('./scripts/karma-config-builder');

const testWebpackConfigBuilderFactory = require('./scripts/webpack.test');

process.env.NODE_ENV = 'test';
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = (config) => {

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
                    .withProgress(false)
                    .build(),
            )
            .addConfig({
                autoWatch: false,
                browsers: ['ChromeHeadlessNoSandbox'],
                customLaunchers: {
                    ChromeHeadlessNoSandbox: {
                        base: 'ChromeHeadless',
                        flags: ['--no-sandbox'],
                    },
                },
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
                junitReporter: {
                    // results will be saved as $outputDir/$browserName.xml
                    outputDir: 'test-reports',
                },
                reporters: ['junit', 'coverage', 'summary'],
                singleRun: true,
                summaryReporter: {
                    specLength: 80,
                },
                webpackMiddleware: {
                    stats: 'minimal',
                },
            })
            .build(),
    );
};
