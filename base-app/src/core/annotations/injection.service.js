import _ from 'lodash';

export const InjectionServiceName = 'injectionService';

export class InjectionService {

    static $inject = ['$injector'];

    constructor($injector) {
        this.$injector = $injector;
    }

    /**
     * @param {Object} instance
     * @return {Object} the given instance
     */
    injectByInjectionNames(instance) {
        if (!_.isObject(instance) || _.isArray(instance)) {
            return instance;
        }

        return this._inject(instance, instance.$inject);
    }

    /**
     * @param {Object} instance
     * @return {Object} the given instance
     */
    injectByStaticInjectionNames(instance) {
        if (!_.isObject(instance) || _.isArray(instance)) {
            return instance;
        }

        const { constructor } = instance;
        const injects = this.$injector.annotate(constructor);

        return this._inject(instance, injects);
    }

    /**
     * @param {Object} instance
     * @param {*} injects
     * @return {Object} the given instance
     */
    _inject(instance, injects) {
        if (_.isArray(injects) || _.isObject(injects)) {
            _.forEach(
                injects,
                (injectName, injectProperty) => {
                    const remapInject = _.isString(injectProperty);
                    const typeProperty = remapInject ? injectProperty : injectName;

                    /* eslint-disable-next-line no-param-reassign */
                    instance[typeProperty] = this.$injector.get(injectName);
                },
            );
        }

        return instance;
    }
}
