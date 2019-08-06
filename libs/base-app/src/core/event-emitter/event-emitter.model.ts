
/**
 * Emits the events to subscribers
 */
export interface Emitter<T> {
    (value: T): angular.IAngularEvent;
}

/**
 * Receives events and their corresponding values
 */
export interface EventConsumer<T> {
    (ngEvent: angular.IAngularEvent, value: T): void;
}

export class EventEmitter<T> {

    public constructor(
        private observeable: Rx.IObservable<[angular.IAngularEvent, T]>,
        private emitter: Emitter<T>,
    ) { }

    public emit(value: T): angular.IAngularEvent {
        return this.emitter(value);
    }

    /**
     * @param consumer consumer of the events
     * @returns function that can dispose the subscription
     */
    public subscribe(consumer: EventConsumer<T>): () => void {
        const rxDisposable = this.observeable.subscribeOnNext(
            ([ngEvent, data]: [angular.IAngularEvent, T]) => { consumer(ngEvent, data); },
        );

        return () => { rxDisposable.dispose(); };
    }
}
