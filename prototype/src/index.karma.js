import _ from 'lodash';
import 'angular';
import 'angular-mocks';
import 'angular-material';
import 'angular-material/angular-material-mocks';

// require all mocks before all specs
(
    (mocksContext) => {
        _.forEach(mocksContext.keys(), (key) => { mocksContext(key); });
    }
)(require.context('.', true, /\.mock\.js$/));

// require all specs
(
    (testsContext) => {
        _.forEach(testsContext.keys(), (key) => {
            describe(key, () => {
                testsContext(key);
            });
        });
    }
)(require.context('.', true, /\.spec\.js$/));
