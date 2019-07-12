
module.exports = {
    extends: [
        'stylelint-config-standard',
    ],
    plugins: [
        'stylelint-no-unsupported-browser-features',
        'stylelint-scss',
    ],
    rules: {
        indentation: [4],
        'selector-type-no-unknown': [true, {
            ignoreNamespaces: '/^app-?/',
            ignoreTypes: '/^app-?/',
        }],
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'plugin/no-unsupported-browser-features': [true, {
            severity: 'warning',
        }],
    },
};
