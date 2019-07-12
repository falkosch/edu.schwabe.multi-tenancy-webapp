module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-preset-env': {},
        'postcss-normalize': {},
    },
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.cssnano = {};
}
