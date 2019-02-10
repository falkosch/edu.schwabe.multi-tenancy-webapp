import _ from 'lodash';
import 'angular';
import 'angular-mocks';
import 'angular-material';
import 'angular-material/angular-material-mocks';

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
