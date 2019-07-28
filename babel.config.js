module.exports = (api) => {
    // do not execute this config js every time a file is compiled
    api.cache.forever();

    return {
        presets: [
            ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3,
            }],
            // this is actually not required for webpack ts-loader, but for eslint-babel-parser
            '@babel/typescript',
        ],
        plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            'lodash',
        ],
    };
};
