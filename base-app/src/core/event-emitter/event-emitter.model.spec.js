import _ from 'lodash';

import { EventEmitterModule } from './event-emitter.module';
import { EventEmitter } from './event-emitter.model';

describe(`${EventEmitterModule}.${EventEmitter.name}`, () => {

    const testValue = 'TEST';

    const expectedEmitReturn = {};

    let testUnit;

    let emitterMock;
    let observableMock;

    beforeEach(() => {

        emitterMock = jasmine.createSpy('emitter');

        observableMock = {
            subscribe: jasmine.createSpy('subscribe'),
        };

        testUnit = new EventEmitter(observableMock, emitterMock);

    });

    describe('.emit(value)', () => {

        beforeEach(() => {
            emitterMock.and.returnValue(expectedEmitReturn);
        });

        it('should emit events via the emitter', () => {
            expect(testUnit.emit(testValue))
                .toBe(expectedEmitReturn);

            expect(emitterMock)
                .toHaveBeenCalledWith(testValue);
        });

    });

    describe('.subscribe(consumer)', () => {

        const testDisposable = {};

        beforeEach(() => {
            observableMock.subscribe
                .and
                .returnValue(testDisposable);
        });

        it('should return the disposable from subscribing to the observable', () => {
            expect(testUnit.subscribe(_.noop))
                .toBe(testDisposable);
        });

        describe('subscriber callback', () => {

            const testEvent = ['testEvent', testValue];

            let consumerMock;

            let actualSubscriber;

            beforeEach(() => {
                consumerMock = jasmine.createSpy('consumer')
                    .and
                    .returnValue(testEvent);

                observableMock.subscribe
                    .and
                    .callFake((subscriber) => {
                        actualSubscriber = subscriber;
                    });

                testUnit.subscribe(consumerMock);
            });

            it('should pass a callback function as subscriber', () => {
                expect(actualSubscriber)
                    .toEqual(jasmine.any(Function));
            });

            it('should call the consumer when event is fired and return the consumer\'s return', () => {
                expect(actualSubscriber(testEvent))
                    .toBe(testEvent);

                expect(consumerMock)
                    .toHaveBeenCalledWith(...testEvent);
            });

        });

    });

});
