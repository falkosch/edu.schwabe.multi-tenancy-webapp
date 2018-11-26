const _ = require('lodash');
const merge = require('webpack-merge');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

class WebpackConfigBuilder {

    constructor() {
        this.configs = [];
        this.entries = [];
        this.htmlWebpackPluginConfigs = [];
        this.tenant = '';
    }

    static isNotEmptyString(value) {
        return _.isString(value) && !_.isEmpty(_.trim(value));
    }

    isWithTenant() {
        return WebpackConfigBuilder.isNotEmptyString(this.tenant);
    }

    withTenant(tenant = '') {
        this.tenant = tenant;
        return this;
    }

    addEntry(entry) {
        if (WebpackConfigBuilder.isNotEmptyString(entry)) {
            this.entries.push(entry);
        }
        return this;
    }

    addHtmlWebpackPluginConfig(config = {}) {
        this.htmlWebpackPluginConfigs.push(config);
        return this;
    }

    addConfig(config = {}) {
        this.configs.push(config);
        return this;
    }

    buildEntry() {
        if (this.isWithTenant()) {
            return [
                ...this.entries,
                path.resolve(__dirname, `./tenancy/${this.tenantName}/${this.tenantName}.module.js`),
            ];
        }

        return [...this.entries];
    }

    buildTemplateParameters() {
        return {
            ngAppModule: this.isWithTenant() ? this.tenantName : 'index',
        };
    }

    buildHtmlWebpackPluginConfig() {
        const templateParameters = this.buildTemplateParameters();

        return merge(
            ...this.htmlWebpackPluginConfigs,
            {
                templateParameters,
            },
        );
    }

    build(...appendConfigs) {
        const entry = this.buildEntry();
        const htmlWebpackPluginConfig = this.buildHtmlWebpackPluginConfig();

        const finalConfig = merge(
            ...this.configs,
            {
                entry,
                plugins: [
                    new HtmlWebpackPlugin(htmlWebpackPluginConfig),
                    new ScriptExtHtmlWebpackPlugin({
                        defaultAttribute: 'defer',
                    }),
                ],
            },
            ...appendConfigs,
        );

        return finalConfig;
    }
}

module.exports = (env = {}) => new WebpackConfigBuilder()
    .withTenant(env.tenant)
    .addEntry('@babel/polyfill')
    .addEntry('./src/index.module.js')
    .addHtmlWebpackPluginConfig({
        template: './src/index.html',
    })
    .addConfig({
        output: {
            path: path.resolve(__dirname, 'dist'),
        },
        optimization: {
            runtimeChunk: {
                name: 'vendors',
            },
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendors: {
                        chunks: 'all',
                        name: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                    },
                },
            },
        },
        plugins: [
            new BundleAnalyzerPlugin(),
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ['babel-loader'],
                },
            ],
        },
    });
