module.exports = {
    root: true,
    extends: [
        'problems', // inherents extends of eslint:recommended
        'plugin:import/recommended',
        'airbnb-base',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jasmine/recommended',
        'plugin:lodash/recommended',
        'plugin:compat/recommended',
        'plugin:sonarjs/recommended',
        'plugin:angular/johnpapa',
    ],
    env: {
        'angular/mocks': false,
        commonjs: true,
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
        'jasmine',
        'sonarjs',
        'html',
        'json',
        'markdown',
    ],
    settings: {
        polyfills: [
            // Marks Promise as polyfilled, see https://github.com/amilajack/eslint-plugin-compat/issues/103#issuecomment-349155444
            "Promise",
        ],
    },
    rules: {
        'class-methods-use-this': 'off',
        indent: ['error', 4],
        'linebreak-style': 'off',
        'no-underscore-dangle': 'off',
        'padded-blocks': 'off',

        'lodash/import-scope': 'off',
        'lodash/prefer-constant': 'off',

        // our modules' file names use the different pattern "<name>.module.<ext>"
        'angular/file-name': 'off',
        // we use ES classes, so we won't use factories
        'angular/no-service-method': 'off',

        // credits: https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js

        // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
        'no-use-before-define': ['error', {
            functions: false,
            classes: false,
            variables: true,
        }],
        '@typescript-eslint/no-use-before-define': ['error', {
            functions: false,
            classes: false,
            variables: true,
            typedefs: true,
        }],
        '@typescript-eslint/explicit-function-return-type': ['error', {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
        }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^__(_*|\\w+)$',
        }]
    },
    overrides: [
        {
            files: [
                '**/*.ts',
            ],
            rules: {
                'no-useless-constructor': 'off',
                'no-empty-function': ['error', {
                    allow: [
                        'arrowFunctions',
                        'functions',
                        'methods',
                        'constructors',
                    ],
                }],
            },
        },
        {
            files: [
                '{libs,apps}/*/src/**/*.{t,j}s',
            ],
            globals: {
                process: true,
                __dirname: true,
                __filename: true,
                VERSION: true,
                PROJECT_PROPERTIES: true,
            },
        },
        {
            files: [
                '{libs,apps}/*/src/**/*.sw.{t,j}s',
                'libs/base-service-worker/src/**/*.sw.{mock,spec}.{t,j}s',
            ],
            env: {
                serviceworker: true,
            },
            rules: {
                'no-restricted-globals': 'off',
                'compat/compat': 'off',
            },
        },
        {
            files: [
                '{libs,apps}/*/src/**/*.module.{t,j}s',
            ],
            rules: {
                'lodash/prefer-lodash-method': 'off',
            },
        },
        {
            files: [
                '**/*.d.ts',
            ],
            rules: {
                'import/no-default-export': 'off',
                'no-restricted-globals': 'off',
            },
        },
        {
            env: {
                jasmine: true,
                'angular/mocks': true,
            },
            files: [
                '{libs,apps}/*/src/**/*.{mock,spec,karma}.{t,j}s',
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
                '{babel,lint-staged,postcss,stylelint}.config.js',
                '**/*.conf.js',
                '{scripts,tools}/**/*.js',
                '{libs,apps}/*/scripts/**/*.js',
                'apps/*/webpack.*.js',
            ],
            rules: {
                'no-console': 'off',
                'import/no-extraneous-dependencies': 'off',
                'sonarjs/no-duplicate-string': 'off',
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
};
