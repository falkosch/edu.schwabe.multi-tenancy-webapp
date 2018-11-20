
export const ProfileUnsetValueFormatterName = 'profileUnsetValueFormatter';

ProfileUnsetValueFormatterDirective.$inject = [];

export function ProfileUnsetValueFormatterDirective() {
    return {
        link,
        require: '^?ngModel',
        restrict: 'A',
    };

    function link(scope, element, attrs, ngModel) {
        if (!ngModel) {
            return;
        }

        ngModel.$formatters.push(formatProfileUnsetValue);

        function formatProfileUnsetValue(value) {
            return value;
        }
    }
}
