const _ = require('lodash');
const merge = require('webpack-merge');

const relativeFilePattern = /^\s*\.\//;

module.exports = class WithTenantConfigBuilder {

    constructor() {
        this.configs = [];
        this.tenant = '';
    }

    static isNotEmptyString(value) {
        return _.isString(value) && !_.isEmpty(_.trim(value));
    }

    static isRelativeFile(file) {
        return WithTenantConfigBuilder.isNotEmptyString(file) && relativeFilePattern.test(file);
    }

    isWithTenant() {
        return WithTenantConfigBuilder.isNotEmptyString(this.tenant);
    }

    withTenant(tenant = '') {
        this.tenant = tenant;
        return this;
    }

    addConfig(config = {}) {
        this.configs.push(config);
        return this;
    }

    build(...appendConfigs) {
        const builtConfig = merge(
            ...this.configs,
            ...appendConfigs,
        );

        return builtConfig;
    }
};
