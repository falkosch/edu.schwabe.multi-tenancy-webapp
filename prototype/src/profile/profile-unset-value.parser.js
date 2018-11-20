
export const ProfileUnsetValueParserName = 'profileUnsetValueParser';

ProfileUnsetValueParserDirective.$inject = [];

export function ProfileUnsetValueParserDirective() {
    return {
        link,
        require: '^?ngModel',
        restrict: 'A',
    };

    function link(scope, element, attrs, ngModel) {
        if (!ngModel) {
            return;
        }

        ngModel.$parsers.push(parseProfileUnsetValue);

        function parseProfileUnsetValue(value) {
            return value;
        }
    }
}
