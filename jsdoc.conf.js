module.exports = {
    plugins: [
        'plugins/markdown',
        'plugins/summarize',
    ],
    recurseDepth: 999,
    source: {
        include: [
            './base-app/src',
            './tenants/tenant1/src',
            './tenants/tenant2/src',
        ],
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
