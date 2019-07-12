const InspectpackPlugin = require('inspectpack/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpack = require('webpack');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const WebpackConfigBuilder = require('../../../scripts/webpack-config-builder');
const common = require('../../../scripts/webpack.common');

function defaultBuilderFactory() {
    return new WebpackConfigBuilder();
}

module.exports = (env = {}, builderFactory = defaultBuilderFactory) => common(env, builderFactory)
    .withRequired('inspectpack/plugin', InspectpackPlugin)
    .withRequired('html-webpack-plugin', HtmlWebpackPlugin)
    .withRequired('script-ext-html-webpack-plugin', ScriptExtHtmlWebpackPlugin)
    .withRequired('webpack', webpack)
    .withRequired('webpack-bundle-analyzer', webpackBundleAnalyzer)
    .withRequired('serviceworker-webpack-plugin', ServiceWorkerWebpackPlugin)
    .addHtmlWebpackPluginConfig({
        template: './src/index.html',
    });
