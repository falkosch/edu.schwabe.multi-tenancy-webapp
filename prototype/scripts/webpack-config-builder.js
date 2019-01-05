const merge = require('webpack-merge');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const WithTenantConfigBuilder = require('./with-tenant-config-builder');

module.exports = class WebpackConfigBuilder extends WithTenantConfigBuilder {

    constructor() {
        super();
        this.context = __dirname;
        this.dist = './dist';
        this.entries = [];
        this.htmlWebpackPluginConfigs = [];
        this.bundleAnalyzer = false;
    }

    withContext(value) {
        this.context = value;
        return this;
    }

    isWithBundleAnalyzer() {
        return this.bundleAnalyzer;
    }

    withBundleAnalyzer(value = true) {
        this.bundleAnalyzer = value;
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

    buildEntry() {
        const tenantIndex = this.buildTenantIndex();

        return [
            ...this.entries,
            `${tenantIndex}.module.js`,
        ];
    }

    buildNgAppModule() {
        if (this.isWithTenant()) {
            return this.tenant;
        }
        return this.defaultIndexModule;
    }

    buildTemplateParameters() {
        const ngAppModule = this.buildNgAppModule();

        return {
            ngAppModule,
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

    buildPlugins() {
        const htmlWebpackPluginConfig = this.buildHtmlWebpackPluginConfig();

        const plugins = [
            new HtmlWebpackPlugin(htmlWebpackPluginConfig),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer',
            }),
        ];

        if (this.isWithBundleAnalyzer()) {
            plugins.push(new BundleAnalyzerPlugin());
        }

        return plugins;
    }

    buildDist() {
        const { dist } = this;
        if (WithTenantConfigBuilder.isRelativeFile(dist)) {
            return path.resolve(this.context, dist);
        }
        return dist;
    }

    buildOutput() {
        const builtDist = this.buildDist();

        return {
            path: builtDist,
        };
    }

    buildRules() {
        const rules = [];

        if (this.isWithTenant()) {
            const tenantPath = this.buildTenantPath();

            rules.push({
                test: /\.scss$/,
                use: [
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            sourceMap: true,
                            resources: [
                                `${tenantPath}/scss/shared/**/*.scss`,
                            ],
                        },
                    },
                ],
            });
        }

        return rules;
    }

    build(...appendConfigs) {
        const entry = this.buildEntry();
        const plugins = this.buildPlugins();
        const output = this.buildOutput();
        const rules = this.buildRules();

        const finalConfig = super.build(
            {
                context: this.context,
                entry,
                plugins,
                output,
                module: {
                    rules,
                },
            },
            ...appendConfigs,
        );

        return finalConfig;
    }
};
