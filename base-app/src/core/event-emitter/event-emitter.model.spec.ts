import _ from 'lodash';

import { EventEmitterModule } from './event-emitter.module';
import { EventEmitter, Emitter, EventConsumer } from './event-emitter.model';

describe(`${EventEmitterModule}.${EventEmitter.name}`, () => {

    const testValue = 'TEST';
    const testEvent: angular.IAngularEvent = {} as any;

    let testUnit: EventEmitter<string>;

    let emitterMock: jasmine.Spy<Emitter<string>>;
    let consumerMock: jasmine.Spy<EventConsumer<string>>;
    let rxDisposableMock: Rx.IDisposable;
    let rxObservableMock: jasmine.SpyObj<Rx.IObservable<[angular.IAngularEvent, string]>>;

    beforeEach(() => {

        emitterMock = jasmine.createSpy('emitter')
            .and.returnValue(testEvent);

        consumerMock = jasmine.createSpy('consumer');

        rxDisposableMock = {
            dispose: jasmine.createSpy('dispose'),
        };

        rxObservableMock = {
            subscribeOnNext: jasmine.createSpy('subscribeOnNext')
                .and.returnValue(rxDisposableMock),
        } as any;

        testUnit = new EventEmitter<string>(rxObservableMock, emitterMock);

    });

    describe('.emit(value)', () => {

        it('should return IAngularEvent events via the emitter', () => {
            expect(testUnit.emit(testValue))
                .toBe(testEvent);

            expect(emitterMock)
                .toHaveBeenCalledWith(testValue);
        });

    });

    describe('.subscribe(consumer)', () => {

        it('should return a disposable of the subscription', () => {
            expect(testUnit.subscribe(_.noop))
                .toEqual(jasmine.any(Function));
        });

        describe('subscriber callback', () => {

            let actualObserver: (value: [angular.IAngularEvent, string]) => void;

            beforeEach(() => {
                rxObservableMock.subscribeOnNext
                    .and.callFake(
                        (onNext: (value: [angular.IAngularEvent, string]) => void) => {
                            actualObserver = onNext;
                            return rxDisposableMock;
                        },
                    );
            });

            it('should pass a callback function as observer', () => {
                testUnit.subscribe(consumerMock);

                expect(actualObserver)
                    .toEqual(jasmine.any(Function));
            });

            it('should call the consumer when event is fired and return the consumer\'s return', () => {
                testUnit.subscribe(consumerMock);

                actualObserver([testEvent, testValue]);

                expect(consumerMock)
                    .toHaveBeenCalledWith(testEvent, testValue);
            });

        });

    });

});
