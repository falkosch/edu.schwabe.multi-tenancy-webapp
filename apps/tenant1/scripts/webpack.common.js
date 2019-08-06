const path = require('path');
const ServiceworkerWebpackPlugin = require('serviceworker-webpack-plugin');

const common = require('../../../scripts/webpack.common');

module.exports = () => common()
    .withAngularI18NPath(
        path.dirname(require.resolve('angular-i18n/package.json')),
    )
    .addResourcesBasePathsToOverride(
        path.dirname(require.resolve('@edu.schwabe.webapp-prototypes/angularjs-base-app')),
    )
    .addResourcesBasePathsToOverride(
        path.dirname(require.resolve('@edu.schwabe.webapp-prototypes/base-service-worker')),
    )
    .addConfig({
        plugins: [
            new ServiceworkerWebpackPlugin({
                entry: './src/tenant1.sw',
                publicPath: './',
            }),
        ],
    })
    .addHtmlWebpackPluginConfig({
        template: './src/tenant1.html',
    });
