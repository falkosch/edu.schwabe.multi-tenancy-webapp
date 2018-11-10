
module.exports = {
    extends: [
        'stylelint-config-standard',
    ],
    plugins: [
        'stylelint-scss',
    ],
    rules: {
        indentation: [4],
        'selector-type-no-unknown': [true, {
            ignoreNamespaces: '/^app-?/',
            ignoreTypes: '/^app-?/',
        }],
    },
};
