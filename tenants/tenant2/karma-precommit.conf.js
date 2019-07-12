const merge = require('webpack-merge');
const puppeteer = require('puppeteer');

const KarmaConfigBuilder = require('../../scripts/karma-config-builder');
const testWebpackConfigBuilderFactory = require('./scripts/webpack.test');
const packageProperties = require('./package.json');

process.env.NODE_ENV = 'test';
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = (config) => {

    const testEnv = merge(
        process.env,
        config.env,
    );

    config.set(
        new KarmaConfigBuilder()
            .withPackageProperties(packageProperties)
            .withWebpackConfig(
                testWebpackConfigBuilderFactory(__dirname, testEnv)
                    .withPackageProperties(packageProperties)
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
                    reporters: [
                        { type: 'text' },
                    ],
                    check: {
                        global: {
                            statements: 80,
                            branches: 80,
                            functions: 80,
                            lines: 80,
                        },
                    },
                },
                reporters: ['spec', 'coverage', 'summary'],
                singleRun: true,
                specReporter: {
                    suppressErrorSummary: false,
                    suppressPassed: true,
                    suppressSkipped: true,
                    showSpecTiming: true,
                    failFast: false,
                },
            })
            .build(),
    );
};
