const _ = require('lodash');

module.exports = {
    '*.{ts,js,json,md}': (filenames) => _.map(filenames, (filename) => `eslint --format=codeframe --fix "${filename}"`),
    '*.ts': () => 'tsc --project tsconfig.json --noEmit',
    '*.{scss,css,svg}': (filenames) => _.map(filenames, (filename) => `stylelint --fix "${filename}"`),
};
