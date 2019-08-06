const _ = require('lodash');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');

const {
    ContextReplacementPlugin,
    DefinePlugin,
    NormalModuleReplacementPlugin,
} = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DuplicatesPlugin } = require('inspectpack/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const ConfigBuilder = require('./config-builder');

module.exports = class WebpackConfigBuilder extends ConfigBuilder {

    constructor() {
        super();
        this.src = path.resolve('.', 'src');
        this.dist = path.resolve('.', 'dist');
        this.entries = [];
        this.htmlWebpackPluginConfigs = [];
        this.resourcesToOverride = /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/;
        this.resourcesBasePathsToOverride = [];
        this.angularI18NPath = path.resolve('.', 'node_modules', 'angular-i18n');
    }

    isWithBundleAnalyzer() {
        return ConfigBuilder.isTruthy(this.bundleAnalyzer);
    }

    withBundleAnalyzer(value = true) {
        this.bundleAnalyzer = value;
        return this;
    }

    isWithResourcesToOverride() {
        return !_.isNil(this.resourcesToOverride);
    }

    withResourcesToOverride(value) {
        this.resourcesToOverride = value;
        return this;
    }

    addResourcesBasePathsToOverride(value) {
        this.resourcesBasePathsToOverride.push(value);
        return this;
    }

    withAngularI18NPath(value) {
        this.angularI18NPath = value;
        return this;
    }

    addEntry(entry) {
        if (ConfigBuilder.isNonEmptyString(entry)) {
            this.entries.push(entry);
        }
        return this;
    }

    addHtmlWebpackPluginConfig(config = {}) {
        this.htmlWebpackPluginConfigs.push(config);
        return this;
    }

    buildEntry() {
        const projectProperties = this.buildProjectProperties();
        return [
            ...this.entries,
            path.resolve(this.src, `${projectProperties.entryModule}.module`),
        ];
    }

    buildTemplateParameters() {
        const packageProperties = this.buildPackageProperties();
        const projectProperties = this.buildProjectProperties();

        return {
            packageProperties,
            projectProperties,
        };
    }

    buildHtmlWebpackPluginConfig() {
        if (_.isEmpty(this.htmlWebpackPluginConfigs)) {
            return undefined;
        }

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
        if (_.isEmpty(this.resourcesBasePathsToOverride)) {
            return undefined;
        }

        return new NormalModuleReplacementPlugin(
            this.resourcesToOverride,
            (resource) => {
                const { context, request } = resource;
                if (_.isNil(request)) {
                    return;
                }
                if (context === this.context) {
                    return;
                }

                const originalFilePath = path.resolve(context, request);

                _.forEach(this.resourcesBasePathsToOverride, (basePath) => {
                    const relativeToBasePath = path.relative(basePath, originalFilePath);

                    if (!_.startsWith(relativeToBasePath, '..')) {
                        const absoluteResourcePathInApp = path.resolve(
                            this.context,
                            this.src,
                            relativeToBasePath,
                        );

                        // when we have a file in app directory, we override the resource request
                        // in base app
                        if (fs.existsSync(absoluteResourcePathInApp)) {
                            // eslint-disable-next-line no-param-reassign
                            resource.request = path.relative(context, absoluteResourcePathInApp);
                        }
                    }
                });
            },
        );
    }

    buildPlugins() {
        const packageProperties = this.buildPackageProperties();
        const projectProperties = this.buildProjectProperties();

        const plugins = [
            new DuplicatesPlugin(),
            new DefinePlugin({
                VERSION: JSON.stringify(packageProperties.version),
                PROJECT_PROPERTIES: JSON.stringify(projectProperties),
            }),
            new ContextReplacementPlugin(
                /moment[/\\]locale$/,
                new RegExp(_.join(projectProperties.language.allAvailable, '|')),
            ),
            new CopyPlugin([{
                flatten: true,
                from: path.resolve(
                    this.angularI18NPath,
                    `angular-locale_{${_.join(projectProperties.language.allAvailable, ',')}}.js`,
                ),
                to: 'i18n',
                toType: 'dir',
            }]),
        ];

        const htmlWebpackPluginConfig = this.buildHtmlWebpackPluginConfig();
        if (htmlWebpackPluginConfig) {
            plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginConfig));
            plugins.push(
                new ScriptExtHtmlWebpackPlugin({
                    defaultAttribute: 'defer',
                }),
            );
        }

        if (this.isWithBundleAnalyzer()) {
            plugins.push(new BundleAnalyzerPlugin());
        }

        const resourcesOverridePlugin = this.buildResourcesOverridePlugin();
        if (resourcesOverridePlugin) {
            plugins.push(resourcesOverridePlugin);
        }

        return plugins;
    }

    buildDist() {
        const { dist } = this;
        if (ConfigBuilder.isRelativeFile(dist)) {
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

    buildResolve() {
        return {
            modules: [
                // solves the duplicate dependency import issues by telling the resolver of webpack
                // to always look first into the bundles node_modules (!) and then somewhere else
                // as would npm do
                path.resolve(this.context, 'node_modules'),
                'node_modules',
            ],
        };
    }

    build(...appendConfigs) {
        const entry = this.buildEntry();
        const plugins = this.buildPlugins();
        const output = this.buildOutput();
        const resolve = this.buildResolve();

        return super.build(
            {
                context: this.context,
                entry,
                plugins,
                output,
                resolve,
            },
            ...appendConfigs,
        );
    }
};
