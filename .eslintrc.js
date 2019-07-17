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
        commonjs: true,
        es6: true,
        jasmine: false,
        node: false,
    },
    parser: 'babel-eslint',
    parserOptions: {
        babelOptions: {
            rootMode: 'upward',
        },
    },
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
                'base-app/src/**/*.js',
                'tenants/*/src/**/*.js',
            ],
            globals: {
                'process': true,
                '__dirname': true,
                '__filename': true,
                'VERSION': true,
                'PROJECT_PROPERTIES': true,
            },
        },
        {
            files: [
                'base-app/src/**/*.sw.js',
                'tenants/*/src/**/*.sw.js',
            ],
            env: {
                serviceworker: true,
            },
            rules: {
                'no-console': 'off',
                'no-restricted-globals': 'off',
                'compat/compat': 'off',
            },
        },
        {
            files: [
                'base-app/src/**/*.module.js',
                'tenants/*/src/**/*.module.js',
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
                'base-app/src/**/*.mock.js',
                'base-app/src/**/*.spec.js',
                'base-app/src/**/*.karma.js',
                'tenants/*/src/**/*.mock.js',
                'tenants/*/src/**/*.spec.js',
                'tenants/*/src/**/*.karma.js',
            ],
            globals: {
                require: true,
            },
            rules: {
                'import/no-extraneous-dependencies': 'off',
                'jasmine/no-spec-dupes': ['warn', 'branch'],
                'jasmine/no-suite-dupes': ['warn', 'branch'],
                'sonarjs/no-duplicate-string': 'off',
                'sonarjs/no-identical-functions': 'off',
            },
        },
        {
            env: {
                browser: false,
                commonjs: false,
                node: true,
            },
            files: [
                'babel.config.js',
                'jsdoc.conf.js',
                'karma*.conf.js',
                'lerna.json',
                'package-lock.json',
                'package.json',
                'postcss.config.js',
                'stylelint.config.js',
                '{scripts,tools}/*',
                'base-app/scripts/*.js',
                'tenants/*/scripts/*.js',
                'tenants/*/webpack.*.js',
            ],
            rules: {
                'no-console': 'off',
                'import/no-extraneous-dependencies': 'off',
                'sonarjs/no-duplicate-string': 'off',
            },
        },
    ],
};
