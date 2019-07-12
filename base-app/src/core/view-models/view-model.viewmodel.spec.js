import _ from 'lodash';
import angular from 'angular';

import { CoreModule } from '../core.module';
import { ViewModel, ViewModelEventChanged, ViewModelEventSaved } from './view-model.viewmodel';
import { EventEmitterServiceName } from '../event-emitter/event-emitter.service';
import { InjectionServiceName } from '../annotations/injection.service';

describe(`${CoreModule}.${ViewModel.name}`, () => {

    const testProperty = 'test';
    const testOldValue = 'old value';
    const testNewValue1 = 'new value';
    const testNewValue2 = 'new value';

    const testOriginalModel = {
        [testProperty]: testOldValue,
    };
    const testChangedModel1 = {
        [testProperty]: testNewValue1,
    };
    const testChangedModel2 = {
        [testProperty]: testNewValue2,
    };

    const testPropertyMappings = {
        [testProperty]: testProperty,
    };

    let testUnitFixtureFactory;
    let testUnit;

    let originalModelMock;
    let eventEmitterMocks;
    let eventEmitterServiceMock;
    let injectionServiceMock;

    let $injector;

    beforeEach(() => {

        originalModelMock = {
            ...testOriginalModel,
        };

        eventEmitterMocks = {
            [ViewModelEventChanged]: {
                subscribe: jasmine.createSpy()
                    .and
                    .callFake((subscriber) => {
                        const eventEmitter = eventEmitterMocks[ViewModelEventChanged];
                        eventEmitter.subscriber = subscriber;
                        return eventEmitter;
                    }),
                emit: jasmine.createSpy(),
            },
            [ViewModelEventSaved]: {
                subscribe: jasmine.createSpy()
                    .and
                    .callFake((subscriber) => {
                        const eventEmitter = eventEmitterMocks[ViewModelEventSaved];
                        eventEmitter.subscriber = subscriber;
                        return eventEmitter;
                    }),
                emit: jasmine.createSpy(),
            },
        };

        eventEmitterServiceMock = {
            of: jasmine.createSpy(),
        };
        eventEmitterServiceMock.of.withArgs(ViewModelEventChanged)
            .and
            .returnValue(eventEmitterMocks[ViewModelEventChanged]);
        eventEmitterServiceMock.of.withArgs(ViewModelEventSaved)
            .and
            .returnValue(eventEmitterMocks[ViewModelEventSaved]);

        angular.mock.module(CoreModule, {
            [EventEmitterServiceName]: eventEmitterServiceMock,
        });

        inject((_$injector_) => {
            $injector = _$injector_;

            injectionServiceMock = $injector.get(InjectionServiceName);
            spyOn(injectionServiceMock, 'injectByStaticInjectionNames').and.callThrough();

            testUnitFixtureFactory = (
                originalModel = originalModelMock,
                TestUnitClassMixin = ViewModel,
            ) => new TestUnitClassMixin(injectionServiceMock, originalModel);

            testUnit = testUnitFixtureFactory();
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            EventEmitterServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(ViewModel)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    describe('.onChanged', () => {

        it(`should be an event emitter created by ${EventEmitterServiceName}`, () => {
            expect(testUnit.onChanged)
                .toBe(eventEmitterMocks[ViewModelEventChanged]);
        });

    });

    describe('.onSaved', () => {

        it(`should be an event emitter created by ${EventEmitterServiceName}`, () => {
            expect(testUnit.onSaved)
                .toBe(eventEmitterMocks[ViewModelEventSaved]);
        });

    });

    describe('.originalModel', () => {

        it('should initially equal the original model passed to the constructor', () => {
            expect(testUnit.originalModel)
                .toEqual(testOriginalModel);
        });

        describe('when transient model changed', () => {

            beforeEach(() => {
                testUnit.transientModel.test = 'new transient';
            });

            it('should be independend and not mutate', () => {
                expect(testUnit.originalModel)
                    .not
                    .toEqual(testUnit.transientModel);
            });

        });

    });

    describe('.transientModel', () => {

        it('should initially be a copy of the given original model', () => {
            expect(testUnit.transientModel)
                .not
                .toBe(testUnit.originalModel);

            expect(testUnit.transientModel)
                .toEqual(testUnit.originalModel);
        });

        describe('when original model changed', () => {

            beforeEach(() => {
                testUnit.originalModel.test = testChangedModel1.test;
            });

            it('should be independently mutable of the original model', () => {
                expect(testUnit.transientModel)
                    .not
                    .toEqual(testUnit.originalModel);
            });

        });

    });

    describe('.save()', () => {

        let originalModelBeforeSave;
        let transientModelBeforeSave;

        beforeEach(() => {
            originalModelBeforeSave = testUnit.originalModel;
            transientModelBeforeSave = testUnit.transientModel;
        });

        it('should set transient model as next original model', () => {
            testUnit.save();

            expect(testUnit.originalModel)
                .not
                .toBe(originalModelBeforeSave);

            expect(testUnit.originalModel)
                .toBe(transientModelBeforeSave);
        });

        it('should set copy of next original model as next transient model', () => {
            testUnit.save();

            expect(testUnit.transientModel)
                .toEqual(testUnit.originalModel);

            expect(testUnit.transientModel)
                .not
                .toBe(testUnit.originalModel);
        });

        it('should emit onSaved event', () => {
            testUnit.save();

            expect(eventEmitterMocks[ViewModelEventSaved].emit)
                .toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        viewModel: testUnit,
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
                    _.assign(testUnit.originalModel, testChangedModel1);
                });

                it('should overwrite changed original model with unchanged transient model', () => {
                    expect(testUnit.originalModel)
                        .toEqual(testChangedModel1);

                    expect(testUnit.transientModel)
                        .toEqual(testOriginalModel);

                    testUnit.save();

                    expect(testUnit.originalModel)
                        .toEqual(testOriginalModel);

                    expect(testUnit.transientModel)
                        .toEqual(testOriginalModel);
                });

            });

            describe('when original model is NOT changed', () => {

                it('should keep unchanged models', () => {
                    expect(testUnit.originalModel)
                        .toEqual(testOriginalModel);

                    expect(testUnit.transientModel)
                        .toEqual(testOriginalModel);

                    testUnit.save();

                    expect(testUnit.originalModel)
                        .toEqual(testOriginalModel);

                    expect(testUnit.transientModel)
                        .toEqual(testOriginalModel);
                });

            });

        });

        describe('when transient model is changed', () => {

            beforeEach(() => {
                _.assign(testUnit.transientModel, testChangedModel2);
                testUnit.$dirty = true;
            });

            it('should reset dirty state', () => {
                testUnit.save();

                expect(testUnit.$dirty)
                    .toBe(false);
            });

            describe('when original model changed', () => {

                beforeEach(() => {
                    _.assign(testUnit.originalModel, testChangedModel1);
                });

                it('should overwrite changed original model with changed transient model', () => {
                    expect(testUnit.originalModel)
                        .toEqual(testChangedModel1);

                    expect(testUnit.transientModel)
                        .toEqual(testChangedModel2);

                    testUnit.save();

                    expect(testUnit.originalModel)
                        .toEqual(testChangedModel2);

                    expect(testUnit.transientModel)
                        .toEqual(testChangedModel2);
                });

            });

            describe('when original model is NOT changed', () => {

                it('should overwrite unchanged original model with changed transient model', () => {
                    expect(testUnit.originalModel)
                        .toEqual(testOriginalModel);

                    expect(testUnit.transientModel)
                        .toEqual(testChangedModel2);

                    testUnit.save();

                    expect(testUnit.originalModel)
                        .toEqual(testChangedModel2);

                    expect(testUnit.transientModel)
                        .toEqual(testChangedModel2);
                });

            });

        });

    });

    describe('.notifyModelChanged(property, oldValue, newValue)', () => {

        it('should set dirty state', () => {
            testUnit.notifyModelChanged(testProperty, testOldValue, testNewValue1);

            expect(testUnit.$dirty)
                .toBe(true);
        });

        it('should emit onChanged event', () => {
            testUnit.notifyModelChanged(testProperty, testOldValue, testNewValue1);

            expect(eventEmitterMocks[ViewModelEventChanged].emit)
                .toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        viewModel: testUnit,
                        property: testProperty,
                        oldValue: testOldValue,
                        newValue: testNewValue1,
                    }),
                );
        });

    });

    describe('mapProperties', () => {

        it('should add mappings on the view model for each given property mapping', () => {
            expect(_.keys(testUnit))
                .not
                .toEqual(
                    jasmine.arrayContaining(_.keys(testPropertyMappings)),
                );

            testUnit.mapProperties(testPropertyMappings);

            expect(_.keys(testUnit))
                .toEqual(
                    jasmine.arrayContaining(_.keys(testPropertyMappings)),
                );
        });

        describe(`mapped getter ${testProperty}`, () => {

            beforeEach(() => {
                testUnit.mapProperties(testPropertyMappings);
            });

            describe('when transient model is NOT changed', () => {

                it('should return the unchanged value from the transient model', () => {
                    expect(testUnit[testProperty])
                        .toBe(testUnit.transientModel[testProperty]);
                });

            });

            describe('when transient model is changed', () => {

                beforeEach(() => {
                    _.assign(testUnit.transientModel, testChangedModel1);
                });

                it('should return the changed value from the transient model', () => {
                    expect(testUnit[testProperty])
                        .toBe(testUnit.transientModel[testProperty]);
                });

            });

        });

        describe(`mapped setter ${testProperty}`, () => {

            beforeEach(() => {
                testUnit.mapProperties(testPropertyMappings);
            });

            it('should set value on mapped property in transient model', () => {
                testUnit[testProperty] = testNewValue1;

                expect(testUnit[testProperty])
                    .toBe(testNewValue1);

                expect(testUnit.transientModel[testProperty])
                    .toBe(testNewValue1);
            });

        });

    });

});
