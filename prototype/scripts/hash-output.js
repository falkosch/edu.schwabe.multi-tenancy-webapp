const _ = require('lodash');
const crypto = require('crypto');
const fs = require('fs');

function _createHashGenerator(algorithmName) {
    const hashGenerator = crypto.createHash(algorithmName);
    hashGenerator.setEncoding('hex');
    return hashGenerator;
}

function _hashFileWithAlgorithm(file, algorithmName) {
    const hashGenerator = _createHashGenerator(algorithmName);

    fs.createReadStream(file)
        .pipe(hashGenerator)
        .pipe(fs.createWriteStream(`${file}.${algorithmName}`));
}

function getSupportedAlgorithms(preferredAlgorithmNames) {
    return _.intersection(crypto.getHashes(), preferredAlgorithmNames);
}

function _hashFile(file) {
    _.forEach(
        getSupportedAlgorithms(['md5', 'sha1', 'sha256', 'sha384', 'sha512']),
        algorithm => _hashFileWithAlgorithm(file, algorithm),
    );
}

const DeployDirectory = `${__dirname}/../deploy`;

fs.readdir(
    DeployDirectory,
    (__, files) => {
        _.forEach(files, file => _hashFile(`${DeployDirectory}/${file}`));
    },
);
