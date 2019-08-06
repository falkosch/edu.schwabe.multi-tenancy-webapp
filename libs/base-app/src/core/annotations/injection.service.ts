import _ from 'lodash';

export const InjectionServiceName = 'injectionService';

export interface TypeConstructor<T> {
    new(...args: any[]): T;
}

interface InjectsMap { [index: string]: string }
type Injects = string[] | InjectsMap;

interface ObjectWithDependenciesOnInstanceProperty {
    $inject: Injects;
}

/**
 * Assigns injectables to a given instance. Use it when you have classes that are not registered
 * to AngularJS but require the dependencies of your AngularJS app. This is f.e. the case for the
 * user state service with its state pattern implementation of the user state cycle between being
 * logged in and logged out.
 */
export class InjectionService {

    public static $inject = ['$injector'];

    public constructor(private $injector: angular.auto.IInjectorService) {
    }

    /**
     * Injects dependencies. The names of the injectables are listed on an
     * instance property, i.e. <code>class A { $inject = ... }</code>.
     *
     * @param instance
     * @return the given instance
     */
    public injectByInjectionNames<T extends ObjectWithDependenciesOnInstanceProperty>(
        instance: T,
    ): T {
        return this._inject(instance, instance.$inject);
    }

    /**
     * Injects dependencies. The names of the injectables are listed in a
     * static class-property, i.e. <code>class A { static $inject = ... }</code>.
     *
     * @param instance
     * @return the given instance
     */
    public injectByStaticInjectionNames<T extends Record<string, any>>(instance: T): T {
        const { constructor } = instance;
        const injects: Injects = this.$injector.annotate(constructor);

        return this._inject(instance, injects);
    }

    /**
     * Instantiates a new instance using the given TypeConstructor and injects dependencies. The
     * names of the injectables are are listed in a static class-property, i.e.
     * <code>class A { static $inject = ... }</code>.
     *
     * @param instance
     * @return the given instance
     */
    public injectByTypeConstructor<T>(
        typeConstructor: TypeConstructor<T>,
        locals?: Record<string, any>,
    ): T {
        return this.$injector.instantiate(typeConstructor, locals);
    }

    /**
     * @param instance
     * @param injects
     * @return the given instance
     */
    private _inject<T extends any>(instance: T, injects: Injects): T {
        if (_.isArray(injects)) {
            _.forEach(
                injects,
                (injectName) => {
                    // eslint-disable-next-line no-param-reassign
                    instance[injectName] = this.$injector.get(injectName);
                },
            );
        } else {
            _.forEach(
                injects,
                (injectName, injectProperty) => {
                    // eslint-disable-next-line no-param-reassign
                    instance[injectProperty] = this.$injector.get(injectName);
                },
            );
        }

        return instance;
    }
}
