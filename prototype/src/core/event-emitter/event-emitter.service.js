export const EventEmitterServiceName = 'eventEmitterService';

class EventEmitter {

    constructor($rootScope, eventName) {
        this.$rootScope = $rootScope;
        this.eventName = eventName;

        this.observeable = this.$rootScope.$eventToObservable(this.eventName);
    }

    emit(value) {
        this.$rootScope.$broadcast(this.eventName, value);
    }

    subscribe(consumer) {
        return this.observeable
            .subscribe(([event, data]) => consumer(event, data));
    }

}

const cachedEmitters = {};

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

        if (injectableName in cachedEmitters) {
            return cachedEmitters[injectableName];
        }

        const eventEmitter = new EventEmitter(this.$rootScope, eventName);

        cachedEmitters[injectableName] = eventEmitter;

        return eventEmitter;
    }

}
