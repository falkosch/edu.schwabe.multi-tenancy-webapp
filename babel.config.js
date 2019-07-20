module.exports = (api) => {
    // do not execute this config js every time a file is compiled
    api.cache.forever();

    return {
        presets: [
            '@babel/preset-env',
            '@babel/typescript',
        ],
        plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            'lodash',
        ],
        env: {
            test: {
                plugins: [
                    ['istanbul', {
                        exclude: [
                            '**/*.karma.{t,j}s',
                            '**/*.spec.{t,j}s',
                            '**/*.mock.{t,j}s',
                        ],
                    }],
                ],
            },
        },
    };
};
