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
                            statements: 31.25,
                            branches: 33.33,
                            functions: 33.33,
                            lines: 45.45,
                        },
                        each: {
                            statements: 31.25,
                            branches: 33.33,
                            functions: 33.33,
                            lines: 45.45,
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
