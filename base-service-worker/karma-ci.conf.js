const puppeteer = require('puppeteer');

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
                coverageIstanbulReporter: {
                    combineBrowserReports: true,
                    dir: 'reports/',
                    fixWebpackSourcePaths: true,
                    skipFilesWithNoCoverage: true,
                    reports: ['text', 'lcovonly', 'cobertura'],
                    thresholds: {
                        global: {
                            statements: 80,
                            lines: 80,
                            branches: 80,
                            functions: 80,
                        },
                    },
                },
                junitReporter: {
                    outputDir: 'reports/test-reports/',
                },
                reporters: ['junit', 'spec', 'coverage-istanbul', 'summary'],
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
