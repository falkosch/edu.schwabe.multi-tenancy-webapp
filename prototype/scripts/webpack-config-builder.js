const _ = require('lodash');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { NormalModuleReplacementPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const WithTenantConfigBuilder = require('./with-tenant-config-builder');

const projectPackage = require('../package.json');

module.exports = class WebpackConfigBuilder extends WithTenantConfigBuilder {

    constructor() {
        super();
        this.context = __dirname;
        this.dist = './dist';
        this.entries = [];
        this.htmlWebpackPluginConfigs = [];
        this.bundleAnalyzer = false;
        this.resourcesToOverride = /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/;
    }

    withContext(value) {
        this.context = value;
        return this;
    }

    isWithResourcesToOverride() {
        return !_.isNil(this.resourcesToOverride);
    }

    withResourcesToOverride(value) {
        this.resourcesToOverride = value;
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
        if (WebpackConfigBuilder.isNonEmptyString(entry)) {
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
            pkg: {
                title: projectPackage.name,
                description: projectPackage.description,
                language: projectPackage[projectPackage.name].language,
            },
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

    buildResourcesOverridePlugin() {
        if (!this.isWithResourcesToOverride()) {
            return undefined;
        }

        const tenantPath = this.buildTenantPath();

        return new NormalModuleReplacementPlugin(
            this.resourcesToOverride,
            (resource) => {
                const { context, request } = resource;

                const originalFilePath = path.resolve(context, request);
                const relativeToDefaultPath = path.relative(this.defaultPath, originalFilePath);

                if (!_.startsWith(relativeToDefaultPath, '..')) {
                    const absoluteTenantPath = path.resolve(tenantPath, relativeToDefaultPath);
                    const tenantPathRelativeToContext = path.relative(
                        context,
                        absoluteTenantPath,
                    );

                    // when we have a file in tenant directory, we override the resource request
                    // in base app
                    if (fs.existsSync(absoluteTenantPath)) {
                        // eslint-disable-next-line no-param-reassign
                        resource.request = tenantPathRelativeToContext;
                    }
                }

            },
        );
    }

    buildPlugins() {
        const tenantIndex = this.buildTenantIndex();
        const htmlWebpackPluginConfig = this.buildHtmlWebpackPluginConfig();

        const plugins = [
            new HtmlWebpackPlugin(htmlWebpackPluginConfig),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer',
            }),
            new ServiceWorkerWebpackPlugin({
                entry: `${tenantIndex}.sw.js`,
            }),
        ];

        if (this.isWithBundleAnalyzer()) {
            plugins.push(new BundleAnalyzerPlugin());
        }

        if (this.isWithTenant()) {
            const resourcesOverridePlugin = this.buildResourcesOverridePlugin();
            if (resourcesOverridePlugin) {
                plugins.push(resourcesOverridePlugin);
            }
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

        return super.build(
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
    }
};
