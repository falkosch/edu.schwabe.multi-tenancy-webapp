import _ from 'lodash';

import '../../src/index.karma';

// require all modules ending in ".spec.js" from the current directory and all subdirectories
(
    (testsContext) => {
        _.forEach(testsContext.keys(), (key) => {
            describe(key, () => {
                testsContext(key);
            });
        });
    }
)(require.context('.', true, /\.spec\.js$/));
