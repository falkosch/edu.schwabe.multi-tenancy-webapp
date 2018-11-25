const _ = require('lodash');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

class ParametersDecorator {

    entry(entryOptions) {
        return entryOptions;
    }

    templateParameters(templateParameterOptions) {
        return templateParameterOptions;
    }
}

class ParametersDecoratorForTenantByName extends ParametersDecorator {

    constructor(tenantName) {
        super();
        this.tenantName = tenantName;
    }

    entry(entryOptions) {
        return _.assign(
            {},
            super.entry(entryOptions),
            {
                [this.tenantName]: `./tenancy/${this.tenantName}/${this.tenantName}.module.js`,
            },
        );
    }

    templateParameters(templateParameterOptions) {
        return _.assign(
            {},
            super.templateParameters(templateParameterOptions),
            {
                ngAppModule: this.tenantName,
            },
        );
    }
}

module.exports = (env = {}) => {

    const { tenant } = env;

    const parametersDecorator = tenant
        ? new ParametersDecoratorForTenantByName(tenant)
        : new ParametersDecorator();

    return {
        entry: parametersDecorator.entry({
            'babel-polyfill': '@babel/polyfill',
            index: './src/index.module.js',
        }),
        output: {
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                templateParameters: parametersDecorator.templateParameters({
                    ngAppModule: 'index',
                }),
            }),
            new BundleAnalyzerPlugin(),
        ],
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
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ['babel-loader'],
                },
            ],
        },
    };
};
