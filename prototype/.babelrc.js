module.exports = (api) => {
    // do not execute this config js every time a file is compiled
    api.cache.forever();

    return {
        presets: [
            '@babel/preset-env',
        ],
        plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-class-properties',
            'lodash',
        ],
        env: {
            test: {
                plugins: [
                    ['istanbul', {
                        exclude: [
                            '{src,tenancy}/**/*.karma.js',
                            '{src,tenancy}/**/*.spec.js'
                        ],
                    }],
                ],
            },
        },
    };
};
