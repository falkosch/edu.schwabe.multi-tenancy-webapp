import _ from 'lodash';

export const InjectionServiceName = 'injectionService';

export class InjectionService {

    static $inject = ['$injector'];

    constructor($injector) {
        this.$injector = $injector;
    }

    /**
     * @param {Function | class} type
     */
    injectByStaticInjectionNames(type) {
        if (_.isNil(type)) {
            return;
        }

        /* eslint-disable no-param-reassign */

        const { $inject } = type;

        if (_.isArray($inject) || _.isObject($inject)) {
            _.forEach(
                $inject,
                (injectName, injectProperty) => {
                    const typeProperty = _.isString(injectProperty) ? injectProperty : injectName;
                    type[typeProperty] = this.$injector.get(injectName);
                },
            );
        }

    }
}
