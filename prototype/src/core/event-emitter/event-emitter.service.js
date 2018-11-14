export const EventEmitterServiceName = 'eventEmitterService';

export class EventEmitterService {

    static $inject = [
        '$injector',
        '$rootScope',
    ];

    constructor($injector, $rootScope) {
        this.$injector = $injector;
        this.$rootScope = $rootScope;
    }

    injectableName(eventName) {
        return `${EventEmitterServiceName}.${eventName}`;
    }

    of(eventName) {

        const injectableName = this.injectableName(eventName);

        if (this.$injector.has(injectableName)) {
            return this.$injector.get(injectableName);
        }

        class EventEmitter {

            emit(value) {
                this.$rootScope.$broadcast(eventName, value);
            }

            subscribe(consumer) {
                return this.$rootScope.$eventToObservable(eventName)
                    .subscribe(consumer);
            }

        }

        return new EventEmitter();
    }

}
