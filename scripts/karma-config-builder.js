const _ = require('lodash');

const ConfigBuilder = require('./config-builder');

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
            `./src/${projectProperties.ngAppModule}.karma.js`,
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

    buildWebpackMiddleware() {
        return {
            stats: 'minimal',
        };
    }

    buildFrameworks() {
        return ['jasmine'];
    }

    build(...appendConfigs) {
        const files = this.buildFiles();
        const frameworks = this.buildFrameworks();
        const preprocessors = this.buildPreprocessors();
        const webpack = this.buildWebpack();
        const webpackMiddleware = this.buildWebpackMiddleware();

        return super.build(
            {
                files,
                preprocessors,
                webpack,
                webpackMiddleware,
                frameworks,
            },
            ...appendConfigs,
        );
    }
};
