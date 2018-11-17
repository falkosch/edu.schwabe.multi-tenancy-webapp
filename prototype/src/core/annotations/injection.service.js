import _ from 'lodash';

export const InjectionServiceName = 'injectionService';

export class InjectionService {

    static $inject = ['$injector'];

    constructor($injector) {
        this.$injector = $injector;
    }

    /**
     * @param {Object} instance
     */
    injectByInjectionNames(instance) {
        if (!_.isObject(instance)) {
            return;
        }

        const { $inject } = instance;

        this._inject(instance, $inject);
    }

    /**
     * @param {Object} instance
     */
    injectByStaticInjectionNames(instance) {
        if (!_.isObject(instance)) {
            return;
        }

        const prototype = Object.getPrototypeOf(instance);
        const { constructor: { $inject } } = prototype;

        this._inject(instance, $inject);
    }

    _inject(instance, $inject) {
        /* eslint-disable no-param-reassign */
        if (_.isArray($inject) || _.isObject($inject)) {
            _.forEach(
                $inject,
                (injectName, injectProperty) => {
                    const remapInject = _.isString(injectProperty);
                    const typeProperty = remapInject ? injectProperty : injectName;
                    instance[typeProperty] = this.$injector.get(injectName);
                },
            );
        }
    }
}
