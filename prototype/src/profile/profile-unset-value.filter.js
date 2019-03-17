import _ from 'lodash';

export const ProfileUnsetValueProviderName = 'profileUnsetValue';

export const ProfileUnsetValueFilterName = `${ProfileUnsetValueProviderName}Filter`;

export function ProfileUnsetValueFilter() {

    return function filterProfileUnsetValue(input) {
        if (_.isNil(input)) {
            return '<not set>';
        }

        return `${input}`;
    };
}
