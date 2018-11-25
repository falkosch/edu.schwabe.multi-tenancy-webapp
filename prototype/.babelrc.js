module.exports = (api) => {
    api.cache(true);

    return {
        presets: [
            ['@babel/preset-env', {
                targets: {
                    browsers: '> 0.25%, not dead'
                },
            }],
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
