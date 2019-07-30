const _ = require('lodash');
const puppeteer = require('puppeteer');

const ConfigBuilder = require('./config-builder');

const chromePath = puppeteer.executablePath();
process.env.CHROME_BIN = chromePath;
process.env.CHROMIUM_BIN = chromePath;

process.env.NODE_ENV = 'test';

module.exports = class KarmaConfigBuilder extends ConfigBuilder {

    constructor() {
        super();
        this.preprocessors = ['webpack', 'sourcemap'];
        this.webpackConfig = {};
    }

    withWebpackConfig(value = {}) {
        this.webpackConfig = value;
        return this;
    }

    withPreprocessors(...preprocessors) {
        this.preprocessors = [...preprocessors];
        return this;
    }

    buildFiles() {
        const projectProperties = this.buildProjectProperties();
        return [
            `./src/${projectProperties.entryModule}.karma.{t,j}s`,
        ];
    }

    buildPreprocessors() {
        const { preprocessors } = this;

        return _.reduce(
            this.buildFiles(),
            (accPreprocessors, file) => (
                {
                    ...accPreprocessors,
                    [file]: [...preprocessors],
                }
            ),
            {},
        );
    }

    buildWebpack() {
        return this.webpackConfig;
    }

    build(...appendConfigs) {
        const files = this.buildFiles();
        const preprocessors = this.buildPreprocessors();
        const webpack = this.buildWebpack();

        return super.build(
            {
                files,
                preprocessors,
                webpack,

                autoWatch: false,
                colors: false,
                coverageIstanbulReporter: {
                    combineBrowserReports: true,
                    dir: 'reports/',
                    fixWebpackSourcePaths: true,
                    skipFilesWithNoCoverage: true,
                },
                customLaunchers: {
                    ChromiumHeadlessNoSandbox: {
                        base: 'ChromiumHeadless',
                        flags: ['--no-sandbox'],
                    },
                    ChromiumDebugging: {
                        base: 'Chromium',
                        flags: [
                            '--remote-debugging-port=9333',
                            '--auto-open-devtools-for-tabs',
                            'http://localhost:9876/debug.html',
                        ],
                    },
                },
                frameworks: ['jasmine'],
                junitReporter: {
                    outputDir: 'reports/test-reports/',
                },
                singleRun: true,
                specReporter: {
                    suppressErrorSummary: false,
                    suppressPassed: true,
                    suppressSkipped: true,
                    showSpecTiming: true,
                    failFast: false,
                },
                summaryReporter: {
                    specLength: 80,
                },
                webpackMiddleware: {
                    stats: 'minimal',
                },
            },
            ...appendConfigs,
        );
    }
};
