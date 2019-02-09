module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'problems',
        'airbnb-base',
        'plugin:jasmine/recommended',
        'plugin:lodash/recommended',
        'plugin:compat/recommended',
        'plugin:sonarjs/recommended',
    ],
    env: {
        'angular/mocks': false,
        browser: true,
        es6: true,
        jasmine: false,
        node: false,
    },
    parser: 'babel-eslint',
    plugins: [
        'angular',
        'compat',
        'html',
        'jasmine',
        'json',
        'lodash',
        'markdown',
        'sonarjs',
    ],
    rules: {
        'class-methods-use-this': 'off',
        indent: ['error', 4],
        'linebreak-style': 'off',
        'no-underscore-dangle': 'off',
        'no-use-before-define': 'off',
        'padded-blocks': 'off',

        'compat/compat': 'error',

        'import/prefer-default-export': 'off',

        'lodash/import-scope': 'off',
        'lodash/prefer-constant': 'off',
    },
    overrides: [
        {
            files: [
                '{src,tenancy}/**/*.js',
            ],
            globals: {
                '__dirname': true,
                '__filename': true,
                '__VERSION__': true,
            },
        },
        {
            files: [
                '{src,tenancy}/**/*.module.js',
            ],
            rules: {
                'lodash/prefer-lodash-method': 'off',
            },
        },
        {
            env: {
                jasmine: true,
                'angular/mocks': true,
            },
            files: [
                '{src,tenancy}/**/*.spec.js',
                '{src,tenancy}/**/*.karma.js',
            ],
            globals: {
                require: true,
            },
            rules: {
                'import/no-extraneous-dependencies': 'off',
            },
        },
        {
            env: {
                browser: false,
                node: true,
            },
            files: [
                '.babelrc.js',
                'jsdoc.conf.js',
                'karma.conf.js',
                'package-lock.json',
                'package.json',
                'postcss.config.js',
                'stylelint.config.js',
                'webpack.*.js',
                'scripts/**/*',
            ],
            rules: {
                'import/no-extraneous-dependencies': 'off',
            },
        },
    ],
};
