const path = require('path');
const ServiceworkerWebpackPlugin = require('serviceworker-webpack-plugin');

const common = require('../../../scripts/webpack.common');

module.exports = () => common()
    .withAngularI18NPath(
        path.dirname(require.resolve('angular-i18n/package.json')),
    )
    .addResourcesBasePathsToOverride(
        path.dirname(require.resolve('@edu.schwabe.multi-tenancy-webapp/angularjs-base-app')),
    )
    .addResourcesBasePathsToOverride(
        path.dirname(require.resolve('@edu.schwabe.multi-tenancy-webapp/base-service-worker')),
    )
    .addConfig({
        plugins: [
            new ServiceworkerWebpackPlugin({
                entry: './src/tenant2.sw',
                publicPath: './',
            }),
        ],
    })
    .addHtmlWebpackPluginConfig({
        template: './src/tenant2.html',
    });
