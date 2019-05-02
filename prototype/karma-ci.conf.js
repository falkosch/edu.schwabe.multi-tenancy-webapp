const merge = require('webpack-merge');
const puppeteer = require('puppeteer');
const _ = require('lodash');

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
                    dir: 'reports/coverage/',
                    subdir: browser => _.head(_.split(_.toLower(browser), /[ /-]/)),
                    reporters: [
                        { type: 'text' },
                        { type: 'lcov' },
                        { type: 'cobertura', file: 'cobertura.xml' },
                    ],
                    check: {
                        global: {
                            statements: 80,
                            branches: 80,
                            functions: 80,
                            lines: 80,
                        },
                        each: {
                            statements: 75,
                            branches: 50,
                            functions: 80,
                            lines: 75,
                        },
                    },
                },
                junitReporter: {
                    outputDir: 'reports/unit-tests/',
                },
                reporters: ['junit', 'spec', 'coverage', 'summary'],
                colors: false,
                singleRun: true,
                specReporter: {
                    suppressErrorSummary: false,
                    showSpecTiming: true,
                    failFast: false,
                },
                summaryReporter: {
                    specLength: 80,
                },
            })
            .build(),
    );
};
