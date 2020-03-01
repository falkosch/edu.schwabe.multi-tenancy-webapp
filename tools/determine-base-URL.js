const { promisify } = require('util');
const _ = require('lodash');
const path = require('path');
const readFile = promisify(require('fs').readFile);
const writeFile = promisify(require('fs').writeFile);
const exec = promisify(require('child_process').exec);
const { EOL } = require('os');

const baseURLBuilder = (function createBaseURLBuilder(deploymentTarget) {

    const defaultBuilder = _.constant('/');
    const DeploymentTargetToBaseURLBuilderMappings = [
        {
            predicate: (target) => target === 'production',
            builder: defaultBuilder,
        },
        {
            predicate: (target) => target === 'staging',
            builder: (entryModule) => `/${entryModule}/`,
        },
        {
            predicate: (target) => !_.isNil(target),
            builder: (entryModule) => `/${deploymentTarget}/${entryModule}/`,
        },
        {
            predicate: _.constant(true),
            builder: defaultBuilder,
        },
    ];

    return _.find(
        DeploymentTargetToBaseURLBuilderMappings,
        ({ predicate }) => predicate(deploymentTarget),
    ).builder;
}(process.argv[2]));

lernaListRepoPackages()
    .then(
        (repoPackages) => Promise.all(
            _.map(repoPackages, (repoPackage) => determineBaseURLFor(repoPackage)),
        ),
    )
    .then((result) => {
        console.log('Jobs done: ', result);
        process.exit(0);
    })
    .catch((error) => {
        console.error('Something went horribly wrong: ', error);
        process.exit(-1);
    });

async function lernaListRepoPackages() {
    const { stdout } = await exec('npx lerna ls -a --json --loglevel silent');
    return JSON.parse(stdout);
}

async function determineBaseURLFor(repoPackage) {
    const packageJSON = await loadPackageJSON(repoPackage);
    const projectProperties = packageJSON[packageJSON.name];
    const newBaseURL = rewriteBaseURLIfPresentOn(projectProperties);
    if (newBaseURL) {
        projectProperties.baseURL = newBaseURL;
        return writeBackPackageJSON(repoPackage, packageJSON)
            .then(_.constant([packageJSON.name, newBaseURL]));
    }
    return [packageJSON.name, undefined];
}

function getPackageJSONPath(repoPackage) {
    return path.resolve(repoPackage.location, 'package.json');
}

async function loadPackageJSON(repoPackage) {
    return JSON.parse(
        await readFile(getPackageJSONPath(repoPackage), 'utf8'),
    );
}

function rewriteBaseURLIfPresentOn(projectProperties) {
    const { baseURL, entryModule } = projectProperties;
    if (baseURL) {
        // rewrite baseURL only if it is present
        return baseURLBuilder(entryModule);
    }
    // do not add a baseURL for packages which have no need for a baseURL
    return undefined;
}

async function writeBackPackageJSON(repoPackage, newPackageJSON) {
    return writeFile(
        getPackageJSONPath(repoPackage),
        `${JSON.stringify(newPackageJSON, undefined, 2)}${EOL}`,
    );
}
