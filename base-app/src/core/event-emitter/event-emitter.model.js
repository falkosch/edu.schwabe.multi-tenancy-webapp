
export class EventEmitter {

    constructor(observeable, emitter) {
        this.observeable = observeable;
        this.emitter = emitter;
    }

    emit(value) {
        return this.emitter(value);
    }

    subscribe(consumer) {
        return this.observeable
            .subscribe(([event, data]) => consumer(event, data));
    }
}
