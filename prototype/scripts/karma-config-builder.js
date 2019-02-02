const _ = require('lodash');

const WithTenantConfigBuilder = require('./with-tenant-config-builder');

module.exports = class KarmaConfigBuilder extends WithTenantConfigBuilder {

    constructor() {
        super();
        this.preprocessors = [];
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

    buildFilesAndPreprocessors() {
        const tenantIndex = this.buildTenantIndex();
        const files = [
            `${tenantIndex}.karma.js`,
        ];

        const builtPreprocessors = _.reduce(
            files,
            (accPreprocessors, file) => (
                {
                    ...accPreprocessors,
                    [file]: [...this.preprocessors],
                }
            ),
            {},
        );

        return {
            files,
            preprocessors: builtPreprocessors,
        };
    }

    build(...appendConfigs) {
        const { files, preprocessors } = this.buildFilesAndPreprocessors();

        return super.build(
            {
                files,
                preprocessors,
                webpack: this.webpackConfig,
            },
            ...appendConfigs,
        );
    }
};
