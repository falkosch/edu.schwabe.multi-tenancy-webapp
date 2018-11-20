import _ from 'lodash';

export const ProfileUnsetValueFilterName = 'profileUnsetValue';

export function ProfileUnsetValueFilter() {

    return function filterProfileUnsetValue(input) {
        if (_.isNil(input)) {
            return '<not set>';
        }

        return `${input}`;
    };
}
