const _ = require('lodash');
const crypto = require('crypto');
const fs = require('fs');

function _getDeployDirectory() {
    const deployDirectory = process.argv.slice(2);
    if (!_.isEmpty(deployDirectory)) {
        return `${process.cwd()}/${deployDirectory}`;
    }
    return `${__dirname}/../deploy`;
}

function _createHashGenerator(algorithmName) {
    const hashGenerator = crypto.createHash(algorithmName);
    hashGenerator.setEncoding('hex');
    return hashGenerator;
}

function _hashFileWithAlgorithm(file, algorithmName) {
    // console.log('Creating', algorithmName, 'hash');
    fs.createReadStream(file)
        .pipe(_createHashGenerator(algorithmName))
        .pipe(fs.createWriteStream(`${file}.${algorithmName}`));
}

function _filterSupportedAlgorithms(preferredAlgorithmNames) {
    return _.intersection(crypto.getHashes(), preferredAlgorithmNames);
}

function _hashFile(file) {
    // console.log('Hashing', file);
    _.forEach(
        _filterSupportedAlgorithms(['md5', 'sha1', 'sha256', 'sha384', 'sha512']),
        algorithm => _hashFileWithAlgorithm(file, algorithm),
    );
}


const deployDirectory = _getDeployDirectory();
fs.readdir(
    deployDirectory,
    (__, files) => {
        _.forEach(files, file => _hashFile(`${deployDirectory}/${file}`));
    },
);
