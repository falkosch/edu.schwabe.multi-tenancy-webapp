const ServiceworkerWebpackPlugin = require('serviceworker-webpack-plugin');

const common = require('../../../scripts/webpack.common');

module.exports = () => common()
    .addConfig({
        plugins: [
            new ServiceworkerWebpackPlugin({
                entry: './src/tenant1.sw',
            }),
        ],
    })
    .addHtmlWebpackPluginConfig({
        template: './src/tenant1.html',
    });
