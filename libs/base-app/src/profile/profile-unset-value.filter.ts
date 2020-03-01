import _ from 'lodash';

export const ProfileUnsetValueProviderName = 'profileUnsetValue';

export const ProfileUnsetValueFilterName = `${ProfileUnsetValueProviderName}Filter`;

export function ProfileUnsetValueFilter(): angular.IFilterFunction {

    return function filterProfileUnsetValue(input: unknown): string {
        if (_.isNil(input)) {
            return '<not set>';
        }

        return `${input}`;
    };
}
