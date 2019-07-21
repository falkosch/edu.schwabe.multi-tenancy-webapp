const puppeteer = require('puppeteer');
const _ = require('lodash');

const KarmaConfigBuilder = require('../scripts/karma-config-builder');
const testWebpackConfigBuilderFactory = require('../scripts/webpack.test');
const packageProperties = require('./package.json');

const chromePath = puppeteer.executablePath();
process.env.CHROME_BIN = chromePath;
process.env.CHROMIUM_BIN = chromePath;

process.env.NODE_ENV = 'test';

module.exports = (config) => {

    config.set(
        new KarmaConfigBuilder()
            .withPackageProperties(packageProperties)
            .withWebpackConfig(
                testWebpackConfigBuilderFactory()
                    .withContext(__dirname)
                    .withPackageProperties(packageProperties)
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
                        { type: 'lcovonly' },
                        { type: 'cobertura', file: 'cobertura.xml' },
                    ],
                    check: {
                        global: {
                            statements: 80,
                            branches: 80,
                            functions: 80,
                            lines: 80,
                        },
                        // we have at least one file with untestable code which lowers coverage
                        // unfortunately
                        each: {
                            statements: 66.67,
                            branches: 50.00,
                            lines: 66.67,
                        },
                    },
                },
                junitReporter: {
                    outputDir: 'reports/test-reports/',
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
