import _ from 'lodash';

// require all mocks before all specs
(
    (mocksContext) => {
        _.forEach(mocksContext.keys(), (key) => { mocksContext(key); });
    }
)(require.context('.', true, /\.mock\.[tj]s$/));

// require all specs
(
    (testsContext) => {
        _.forEach(testsContext.keys(), (key) => {
            describe(key, () => {
                testsContext(key);
            });
        });
    }
)(require.context('.', true, /\.spec\.[tj]s$/));
