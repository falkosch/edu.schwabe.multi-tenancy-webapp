const KarmaConfigBuilder = require('../../scripts/karma-config-builder');
const testWebpackConfigBuilderFactory = require('../../scripts/webpack.test');
const packageProperties = require('./package.json');

module.exports = (config) => {

    config.set(
        new KarmaConfigBuilder()
            .withPackageProperties(packageProperties)
            .withWebpackConfig(
                testWebpackConfigBuilderFactory()
                    .withContext(__dirname)
                    .withPackageProperties(packageProperties)
                    .build(),
            )
            .addConfig({
                browsers: ['ChromiumHeadlessNoSandbox'],
                coverageIstanbulReporter: {
                    reports: ['text-summary'],
                    thresholds: {
                        global: {
                            statements: 80,
                            lines: 80,
                            branches: 80,
                            functions: 80,
                        },
                    },
                },
                reporters: ['spec', 'coverage-istanbul', 'summary'],
            })
            .build(),
    );
};
