const _ = require('lodash');
const merge = require('webpack-merge');

const relativeFilePattern = /^\s*\.\//;
const tenantIndexGenerator = tenant => `./tenancy/${tenant}/${tenant}`;

module.exports = class WithTenantConfigBuilder {

    constructor() {
        this.configs = [];
        this.defaultIndexModule = 'index';
        this.defaultIndex = './src/index';
        this.tenant = '';
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

    buildTenantIndex() {
        if (this.isWithTenant()) {
            return tenantIndexGenerator(this.tenant);
        }
        return this.defaultIndex;
    }

    static isNotEmptyString(value) {
        return _.isString(value) && !_.isEmpty(_.trim(value));
    }

    static isRelativeFile(file) {
        return WithTenantConfigBuilder.isNotEmptyString(file) && relativeFilePattern.test(file);
    }

};
