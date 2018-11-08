module.exports = {
    extends: 'airbnb-base',
    parser: 'babel-eslint',
    plugins: [
        'mocha',
    ],
    rules: {
        'indent': ['error', 4],
        'linebreak-style': 'off',
        'import/prefer-default-export': 'off',
        'no-use-before-define': 'off',
        'padded-blocks': 'off',
    },
    overrides: [
        {
            files: [
                'src/**/*.spec.js',
            ],
            env: {
                mocha: true,
            },
            globals: {
                angular: true,
                inject: true,
            },
            rules: {
            },
        },
        {
            files: [
                'webpack.*',
                'src/app.karma.js',
                'src/**/*.spec.js',
            ],
            rules: {
                'import/no-extraneous-dependencies': 'off',
            },
        },
    ],
};
