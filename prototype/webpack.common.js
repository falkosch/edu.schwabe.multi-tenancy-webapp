const merge = require('webpack-merge');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const WithTenantConfigBuilder = require('./scripts/with-tenant-config-builder');

class WebpackConfigBuilder extends WithTenantConfigBuilder {

    constructor() {
        super();
        this.context = __dirname;
        this.dist = './dist';
        this.entries = [];
        this.htmlWebpackPluginConfigs = [];
        this.bundleAnalyzer = false;
    }

    withContext(context) {
        if (WebpackConfigBuilder.isNotEmptyString(context)) {
            this.context = context;
        }
        return this;
    }

    withDist(dist) {
        if (WebpackConfigBuilder.isNotEmptyString(dist)) {
            this.dist = dist;
        }
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
        const entries = [...this.entries];

        let scssMainFile = './src/index.scss';
        if (this.isWithTenant()) {
            scssMainFile = `./tenancy/${this.tenant}/${this.tenant}.scss`;
            entries.push(`./tenancy/${this.tenant}/${this.tenant}.module.js`);
        }
        entries.push(scssMainFile);

        return entries;
    }

    buildTemplateParameters() {
        return {
            ngAppModule: this.isWithTenant() ? this.tenant : 'index',
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

    build(...appendConfigs) {
        const entry = this.buildEntry();
        const plugins = this.buildPlugins();
        const output = this.buildOutput();

        return super.build(
            {
                context: this.context,
                entry,
                plugins,
                output,
            },
            ...appendConfigs,
        );
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
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
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
