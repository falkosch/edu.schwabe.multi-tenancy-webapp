module.exports = {
    extends: 'airbnb-base',
    parser: 'babel-eslint',
    env: {
        mocha: true
    },
    plugins: [
        'mocha'
    ],
    rules: {
        'indent': ['error', 4],
        'linebreak-style': 'off',
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-use-before-define': 'off',
    },
};