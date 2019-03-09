import _ from 'lodash';

import { EventEmitter } from './event-emitter.model';

export const EventEmitterServiceName = 'eventEmitterService';

export const EventEmitterCacheId = `${EventEmitterServiceName}Cache`;

export class EventEmitterService {

    static $inject = [
        '$injector',
        '$rootScope',
        '$cacheFactory',
    ];

    _cachedEmitters;

    constructor($injector, $rootScope, $cacheFactory) {
        this.$injector = $injector;
        this.$rootScope = $rootScope;
        this.$cacheFactory = $cacheFactory;

        this._init();
    }

    _init() {
        this._cachedEmitters = this.$cacheFactory(EventEmitterCacheId);
    }

    injectableName(eventName) {
        return `${EventEmitterServiceName}.${eventName}`;
    }

    of(eventName) {
        const emitterName = this.injectableName(eventName);

        let eventEmitter = this._cachedEmitters.get(emitterName);

        if (_.isNil(eventEmitter)) {
            if (this.$injector.has(emitterName)) {
                eventEmitter = this.$injector.get(emitterName);
            }

            if (_.isNil(eventEmitter)) {
                const observable = this.$rootScope.$eventToObservable(eventName);
                const emitter = (value => this.$rootScope.$broadcast(eventName, value));

                eventEmitter = new EventEmitter(observable, emitter);
            }

            this._cachedEmitters.put(emitterName, eventEmitter);
        }

        return eventEmitter;
    }

}
