const ServiceworkerWebpackPlugin = require('serviceworker-webpack-plugin');

const common = require('../../../scripts/webpack.common');

module.exports = () => common()
    .addConfig({
        plugins: [
            new ServiceworkerWebpackPlugin({
                entry: './src/tenant2.sw',
            }),
        ],
    })
    .addHtmlWebpackPluginConfig({
        template: './src/tenant2.html',
    });
