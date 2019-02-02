const _ = require('lodash');
const merge = require('webpack-merge');

const relativeFilePattern = /^\s*\.\//;

module.exports = class WithTenantConfigBuilder {

    constructor() {
        this.configs = [];
        this.defaultIndexModule = 'index';
        this.defaultIndex = './index';
        this.defaultPath = './src';
        this.defaultTenancy = './tenancy';
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
        return merge(
            ...this.configs,
            ...appendConfigs,
        );
    }

    buildTenantPath() {
        if (this.isWithTenant()) {
            return `${this.defaultTenancy}/${this.tenant}`;
        }
        return this.defaultPath;
    }

    buildTenantIndex() {
        const tenantPath = this.buildTenantPath();
        if (this.isWithTenant()) {
            return `${tenantPath}/${this.tenant}`;
        }
        return `${tenantPath}/${this.defaultIndex}`;
    }

    static isNotEmptyString(value) {
        return _.isString(value) && !_.isEmpty(_.trim(value));
    }

    static isRelativeFile(file) {
        return WithTenantConfigBuilder.isNotEmptyString(file) && relativeFilePattern.test(file);
    }

};
