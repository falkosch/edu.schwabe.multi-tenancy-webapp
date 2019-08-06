const _ = require('lodash');
const merge = require('webpack-merge');
const { ProgressPlugin } = require('webpack');

const KarmaConfigBuilder = require('../../scripts/karma-config-builder');
const testWebpackConfigBuilderFactory = require('../../scripts/webpack.test');
const packageProperties = require('./package.json');

module.exports = (config) => {

    const testEnv = merge(
        process.env,
        config.env,
    );

    config.set(
        new KarmaConfigBuilder()
            .withPackageProperties(packageProperties)
            .withWebpackConfig(
                testWebpackConfigBuilderFactory()
                    .withContext(__dirname)
                    .withPackageProperties(packageProperties)
                    .addConfig({
                        plugins: [
                            new ProgressPlugin(),
                        ],
                    })
                    .build(),
            )
            .addConfig({
                browsers: ['ChromiumHeadlessNoSandbox'],
                coverageIstanbulReporter: {
                    reports: ['text'],
                },
                reporters: _.concat(
                    testEnv.noSpec ? [] : ['spec'],
                    testEnv.noCoverage ? [] : ['coverage-istanbul'],
                    ['summary'],
                ),
            })
            .build({
                autoWatch: true,
                colors: true,
                singleRun: false,
            }),
    );
};
