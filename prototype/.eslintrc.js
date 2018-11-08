module.exports = {
    extends: [
        'airbnb-base',
        'plugin:jasmine/recommended',
        'plugin:lodash/canonical',
    ],
    parser: 'babel-eslint',
    plugins: [
        'jasmine',
        'lodash',
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
                jasmine: true,
            },
            globals: {
                angular: true,
                inject: true,
            },
            rules: {
                'jasmine/no-spec-dupes': 'off',
            },
        },
        {
            files: [
                'webpack.*',
                'src/app.karma.js',
                'src/**/*.spec.js',
            ],
            rules: {
                'import/no-extraneous-dependencies': 'off'
            },
        },
    ],
};
