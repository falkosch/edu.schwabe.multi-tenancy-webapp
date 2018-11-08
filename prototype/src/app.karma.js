import * as _ from 'lodash';
import 'angular';
import 'angular-mocks';

// require all modules ending in ".spec.js" from the current directory and all subdirectories
const testsContext = require.context('.', true, /\.spec\.js$/);
_.forEach(testsContext.keys(), testsContext);
