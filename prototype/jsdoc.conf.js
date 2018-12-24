
module.exports = {
    plugins: [
        'plugins/markdown',
        'plugins/summarize',
    ],
    recurseDepth: 999,
    source: {
        include: ['./src', './tenancy'],
    },
    opts: {
        encoding: 'utf8',
        destination: './docs',
        recurse: true,
        readme: './README.md',
    },
    tags: {
        allowUnknownTags: false,
        dictionaries: ['jsdoc', 'closure'],
    },
    templates: {
        cleverLinks: true,
    },
};
