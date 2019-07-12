const _ = require('lodash');
const merge = require('webpack-merge');

const relativeFilePattern = /^\s*\.\//;

module.exports = class ConfigBuilder {

    constructor() {
        this.configs = [];
    }

    withContext(value) {
        this.context = value;
        return this;
    }

    withPackageProperties(value) {
        this.packageProperties = value;
        return this;
    }

    addConfig(config = {}) {
        this.configs.push(config);
        return this;
    }

    buildPackageProperties() {
        return this.packageProperties;
    }

    buildProjectProperties() {
        const packageProperties = this.buildPackageProperties();
        return packageProperties[packageProperties.name];
    }

    build(...appendConfigs) {
        return merge(
            ...this.configs,
            ...appendConfigs,
        );
    }

    static isTruthy(value) {
        return _.includes([true, 1, -1, 'true', 'TRUE', 'True'], value);
    }

    static isFalsy(value) {
        return _.includes([false, 0, 'false', 'FALSE', 'False', undefined, null], value);
    }

    static isNonEmptyString(value) {
        return _.isString(value) && !_.isEmpty(_.trim(value));
    }

    static isRelativeFile(file) {
        return ConfigBuilder.isNonEmptyString(file) && relativeFilePattern.test(file);
    }

};
