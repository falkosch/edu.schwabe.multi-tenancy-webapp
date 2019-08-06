import _ from 'lodash';

import { EventEmitter } from './event-emitter.model';

export const EventEmitterServiceName = 'eventEmitterService';

export const EventEmitterCacheId = `${EventEmitterServiceName}Cache`;

export class EventEmitterService {

    public static $inject = [
        '$injector',
        '$rootScope',
        '$cacheFactory',
    ];

    private _cachedEmitters: angular.ICacheObject;

    public constructor(
        private $injector: angular.auto.IInjectorService,
        private $rootScope: rx.angular.IRxScope,
        private $cacheFactory: angular.ICacheFactoryService,
    ) {
        this._cachedEmitters = this.$cacheFactory(EventEmitterCacheId);
    }

    public injectableName(eventName: string): string {
        return `${EventEmitterServiceName}.${eventName}`;
    }

    public of<T>(eventName: string): EventEmitter<T> {
        const emitterName = this.injectableName(eventName);
        const cachedEventEmitter: EventEmitter<T> | undefined = this._cachedEmitters
            .get(emitterName);

        if (!_.isNil(cachedEventEmitter)) {
            return cachedEventEmitter;
        }

        return this.injectOrCreateEventEmitter(eventName, emitterName);
    }

    private injectOrCreateEventEmitter<T>(eventName: string, emitterName: string): EventEmitter<T> {
        const eventEmitter: EventEmitter<T> = this.$injector.has(emitterName)
            ? this.$injector.get(emitterName)
            : this.createEventEmitter<T>(eventName);

        this._cachedEmitters.put(emitterName, eventEmitter);
        return eventEmitter;
    }

    private createEventEmitter<T>(eventName: string): EventEmitter<T> {
        const observable: Rx.IObservable<[angular.IAngularEvent, T]> = this.$rootScope
            .$eventToObservable(eventName);

        const emitter = (value: T): angular.IAngularEvent => this.$rootScope
            .$broadcast(eventName, value);

        return new EventEmitter(observable, emitter);
    }

}
