module.exports = {
    '*.{js,json,md}': () => ['eslint --format=codeframe --fix', 'git add'],
    '*.ts': () => ['tsc --project tsconfig.json --noEmit', 'eslint --format=codeframe --fix', 'git add'],
    '*.{scss,css,svg}': () => ['stylelint --fix', 'git add'],
};
