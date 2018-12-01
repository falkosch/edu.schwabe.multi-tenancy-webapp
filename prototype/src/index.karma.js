import _ from 'lodash';
import 'angular';
import 'angular-mocks';
import 'angular-material';
import 'angular-material/angular-material-mocks';

// require all modules ending in ".spec.js" from the current directory and all subdirectories
const testsContext = require.context('.', true, /\.spec\.js$/);
_.forEach(testsContext.keys(), (key) => {
    describe(key, () => {
        testsContext(key);
    });
});
