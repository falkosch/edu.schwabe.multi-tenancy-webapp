const InspectpackPlugin = require('inspectpack/plugin');
const webpack = require('webpack');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const common = require('../../../scripts/webpack.test');

module.exports = (context, env = {}) => common(context, env)
    .withRequired('inspectpack/plugin', InspectpackPlugin)
    .withRequired('webpack', webpack)
    .withRequired('webpack-bundle-analyzer', webpackBundleAnalyzer)
    .withRequired('serviceworker-webpack-plugin', ServiceWorkerWebpackPlugin);
