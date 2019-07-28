import _ from 'lodash';
import angular from 'angular';

import { CoreModule } from '../core.module';
import { EventEmitterServiceName, EventEmitterService } from '../event-emitter/event-emitter.service';
import {
    ReactiveViewWithMappings,
    ViewEvents,
    OriginalModelInjectName,
    MappingsInjectName,
    PropertyPathMapping,
} from './reactive-view-with-mappings.model';
import { EventEmitter, EventConsumer } from '../event-emitter/event-emitter.model';
import { ViewChangedEventData } from './models/view-changed-event.model';

describe(`${CoreModule}.${ReactiveViewWithMappings.name}`, () => {

    interface TestViewModel {
        test: string;
    }

    const testValue = 'test';

    const testValueOther1 = 'TEST1';

    const testValueOther2 = 'TEST2';

    const testPropertyPath = 'a.b';

    const testViewModelProperty: keyof TestViewModel = 'test';

    const testMappings: PropertyPathMapping<TestViewModel> = {
        [testViewModelProperty]: testPropertyPath,
    };

    class TestModel {
        public a: { b: string };

        public constructor(value: string = testValue) {
            this.a = { b: value };
        }
    }

    let testUnitFixtureFactory: (
        value?: string,
        mappings?: PropertyPathMapping<TestViewModel>,
    ) => ReactiveViewWithMappings<TestModel, TestViewModel>;
    let testUnit: ReactiveViewWithMappings<TestModel, TestViewModel>;

    let eventEmitterConsumers: Record<ViewEvents, EventConsumer<any>>;
    let eventEmitterMocks: Record<ViewEvents, jasmine.SpyObj<EventEmitter<any>>>;
    let eventEmitterServiceMock: jasmine.SpyObj<EventEmitterService>;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        eventEmitterConsumers = {
            [ViewEvents.Changed]: jasmine.createSpy().and.throwError('test failure'),
            [ViewEvents.Saved]: jasmine.createSpy().and.throwError('test failure'),
        };

        eventEmitterMocks = {
            [ViewEvents.Changed]: {
                subscribe: jasmine.createSpy()
                    .and.callFake((consumer) => {
                        eventEmitterConsumers[ViewEvents.Changed] = consumer;
                        return eventEmitterMocks[ViewEvents.Changed];
                    }),
                emit: jasmine.createSpy(),
            } as any,
            [ViewEvents.Saved]: {
                subscribe: jasmine.createSpy()
                    .and.callFake((consumer) => {
                        eventEmitterConsumers[ViewEvents.Saved] = consumer;
                        return eventEmitterMocks[ViewEvents.Saved];
                    }),
                emit: jasmine.createSpy(),
            } as any,
        };

        eventEmitterServiceMock = {
            of: jasmine.createSpy()
                .withArgs(ViewEvents.Changed)
                .and.returnValue(eventEmitterMocks[ViewEvents.Changed])
                .withArgs(ViewEvents.Saved)
                .and.returnValue(eventEmitterMocks[ViewEvents.Saved]),
        } as any;

        testUnitFixtureFactory = (
            value?: string,
            mappings?: PropertyPathMapping<TestViewModel>,
        ) => {
            class TestView extends ReactiveViewWithMappings<TestModel, TestViewModel> {

                public constructor() {
                    super(eventEmitterServiceMock, new TestModel(value));
                    if (mappings) {
                        this.mapProperties(mappings);
                    }
                }
            }

            return new TestView();
        };

        testUnit = testUnitFixtureFactory();

        angular.mock.module(CoreModule, {
            [EventEmitterServiceName]: eventEmitterServiceMock,
        });

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            EventEmitterServiceName,
            OriginalModelInjectName,
            MappingsInjectName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(ReactiveViewWithMappings)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    describe('.onChanged', () => {

        it(`should be an event emitter created by ${EventEmitterServiceName}`, () => {
            expect(testUnit.onChanged)
                .toBe(eventEmitterMocks[ViewEvents.Changed]);
        });

    });

    describe('.onSaved', () => {

        it(`should be an event emitter created by ${EventEmitterServiceName}`, () => {
            expect(testUnit.onSaved)
                .toBe(eventEmitterMocks[ViewEvents.Saved]);
        });

    });

    describe('.viewModel', () => {

        describe('when no mapping is initialized', () => {

            it('should return undefined', () => {
                expect(testUnit.viewModel)
                    .toBeUndefined();
            });

        });

        describe('when a mapping is initialized', () => {

            beforeEach(() => {
                testUnit = testUnitFixtureFactory(testValue, testMappings);
            });

            it('should return the mapping view model', () => {
                expect(testUnit.viewModel)
                    .toBeDefined();
            });

            it('should have mappings for each property on the view model ', () => {
                expect(_.keys(testUnit.viewModel))
                    .toEqual(_.keys(testMappings));
            });

            describe('mapped getters', () => {

                it('should return values from the transient model', () => {
                    // @ts-ignore
                    expect(testUnit.viewModel.test)
                        .toBe(testUnit.transientModel.a.b);
                });

            });

            describe('mapped setters', () => {

                it('should set values in transient model', () => {
                    // @ts-ignore
                    testUnit.viewModel.test = testValueOther1;

                    expect(testUnit.transientModel.a.b)
                        .toBe(testValueOther1);
                });

            });

        });

    });

    describe('.originalModel', () => {

        it('should initially equal the original model passed to the constructor', () => {
            expect(testUnit.originalModel)
                .toEqual(jasmine.any(TestModel));
        });

        describe('when transient model changes', () => {

            beforeEach(() => {
                testUnit.transientModel.a.b = testValueOther1;
            });

            it('should be independend and not mutate the original model', () => {
                expect(testUnit.originalModel)
                    .not.toEqual(testUnit.transientModel);
            });

        });

    });

    describe('.transientModel', () => {

        it('should initially be a copy of the given original model', () => {
            expect(testUnit.transientModel)
                .not.toBe(testUnit.originalModel);

            expect(testUnit.transientModel)
                .toEqual(testUnit.originalModel);
        });

    });

    describe('.save()', () => {

        let originalModelBeforeSave: TestModel;
        let transientModelBeforeSave: TestModel;

        beforeEach(() => {
            originalModelBeforeSave = testUnit.originalModel;
            transientModelBeforeSave = testUnit.transientModel;
        });

        it('should set transient model as next original model', () => {
            testUnit.save();

            expect(testUnit.originalModel)
                .not.toBe(originalModelBeforeSave);

            expect(testUnit.originalModel)
                .toBe(transientModelBeforeSave);
        });

        it('should set copy of next original model as next transient model', () => {
            testUnit.save();

            expect(testUnit.transientModel)
                .toEqual(testUnit.originalModel);

            expect(testUnit.transientModel)
                .not.toBe(testUnit.originalModel);
        });

        it('should emit onSaved event', () => {
            testUnit.save();

            expect(eventEmitterMocks[ViewEvents.Saved].emit)
                .toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        view: testUnit,
                    }),
                );
        });

        describe('when transient model is NOT changed', () => {

            beforeEach(() => {
                testUnit.$dirty = false;
            });

            it('should keep unchanged dirty state', () => {
                testUnit.save();

                expect(testUnit.$dirty)
                    .toBe(false);
            });

            describe('when original model changed', () => {

                beforeEach(() => {
                    originalModelBeforeSave.a.b = testValueOther1;
                });

                it('should overwrite changed original model with unchanged transient model', () => {
                    testUnit.save();

                    expect(testUnit.originalModel)
                        .not.toEqual(originalModelBeforeSave);
                });

            });

            describe('when original model is NOT changed', () => {

                it('should keep unchanged models', () => {
                    testUnit.save();

                    expect(testUnit.originalModel)
                        .toEqual(originalModelBeforeSave);
                });

            });

        });

        describe('when transient model is changed', () => {

            beforeEach(() => {
                transientModelBeforeSave.a.b = testValueOther1;
                testUnit.$dirty = true;
            });

            it('should reset dirty state', () => {
                testUnit.save();

                expect(testUnit.$dirty)
                    .toBe(false);
            });

            describe('when original model changed too', () => {

                beforeEach(() => {
                    originalModelBeforeSave.a.b = testValueOther2;
                });

                it('should overwrite changed original model with changed transient model', () => {
                    testUnit.save();

                    expect(testUnit.originalModel)
                        .toEqual(transientModelBeforeSave);
                });

            });

            describe('when original model is NOT changed', () => {

                it('should overwrite unchanged original model with changed transient model', () => {
                    testUnit.save();

                    expect(testUnit.originalModel)
                        .toEqual(transientModelBeforeSave);
                });

            });

        });

    });

    describe('.getModelValue(propertyPath)', () => {

        it('should return values from the transient model', () => {
            expect(testUnit.getModelValue(testPropertyPath))
                .toBe(testValue);
        });

    });

    describe('.setModelValue(property, oldValue, newValue)', () => {

        it('should set dirty state', () => {
            testUnit.setModelValue(testValueOther1, testViewModelProperty, testPropertyPath);

            expect(testUnit.$dirty)
                .toBe(true);
        });

        it('should emit onChanged event', () => {
            testUnit.setModelValue(testValueOther1, testViewModelProperty, testPropertyPath);

            expect(eventEmitterMocks[ViewEvents.Changed].emit)
                .toHaveBeenCalledWith(
                    new ViewChangedEventData(
                        testUnit,
                        testViewModelProperty,
                        testPropertyPath,
                        testValue,
                        testValueOther1,
                    ),
                );
        });

    });

});
