module.exports = {
    extends: [
        'airbnb-base',
        'plugin:jasmine/recommended',
        'plugin:lodash/canonical',
        'plugin:compat/recommended',
    ],
    env: {
        browser: true,
    },
    parser: 'babel-eslint',
    plugins: [
        'compat',
        'jasmine',
        'lodash',
    ],
    rules: {
        'compat/compat': 'error',
        'indent': ['error', 4],
        'linebreak-style': 'off',
        'import/prefer-default-export': 'off',
        'no-use-before-define': 'off',
        'padded-blocks': 'off',
        'class-methods-use-this': 'off',
        'lodash/prefer-constant': 'off',
        'lodash/prefer-lodash-method': 'off',
        'no-param-reassign': 'off',
        'no-underscore-dangle': 'off',
    },
    overrides: [
        {
            files: [
                '{src,tenancy}/**/*.spec.js',
                '{src,tenancy}/**/*.karma.js',
            ],
            env: {
                jasmine: true,
            },
            globals: {
                inject: true,
            },
            rules: {
                'jasmine/no-spec-dupes': 'off',
            },
        },
        {
            files: [
                'karma.conf.js',
                'stylelint.config.js',
                'jsdoc.conf.js',
                '.babelrc.js',
                'webpack.*',
                'scripts/**/*',
                '{src,tenancy}/**/*.karma.js',
                '{src,tenancy}/**/*.spec.js',
            ],
            rules: {
                'import/no-extraneous-dependencies': 'off'
            },
        },
        {
            files: [
                'karma.conf.js',
                'stylelint.config.js',
                'jsdoc.conf.js',
                '.babelrc.js',
                'webpack.*',
                'scripts/**/*',
            ],
            env: {
                browser: false,
                node: true,
            },
        },
    ],
};
