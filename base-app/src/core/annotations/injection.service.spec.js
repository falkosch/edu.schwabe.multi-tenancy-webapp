import _ from 'lodash';
import angular from 'angular';

import { AnnotationsModule } from './annotations.module';
import { InjectionServiceName, InjectionService } from './injection.service';

describe(`${AnnotationsModule}.${InjectionServiceName}`, () => {

    const testImmutableValues = _.map(
        [undefined, null, 0, 1, 0.1, true, false, '', 'test', String(''), String('test'), [], ['']],
        v => Object.freeze(v),
    );

    let testUnit;

    let $q;
    let $injector;

    beforeEach(() => {

        angular.mock.module(AnnotationsModule);

        inject((_$q_, _$injector_) => {
            $q = _$q_;
            $injector = _$injector_;
            testUnit = $injector.get(InjectionServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$injector',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(InjectionService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${InjectionService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(InjectionService));
        });

    });

    describe('.injectByInjectionNames(instance)', () => {

        it('should always return the given value of parameter instance', () => {
            const expectedInstance = {};

            expect(testUnit.injectByInjectionNames(expectedInstance))
                .toBe(expectedInstance);
        });

        describe('when value for parameter instance is NOT an object', () => {

            it('should not mutate the value', () => {

                _.forEach(testImmutableValues, (value) => {

                    expect(() => testUnit.injectByInjectionNames(value))
                        .not
                        .toThrow();

                    expect(testUnit.injectByInjectionNames(value))
                        .toBe(value);

                });

            });

        });

        describe('when value for parameter instance is an object', () => {

            describe('when instance property $inject is neither an array nor an object', () => {

                it('should not mutate the instance', () => {

                    const originalInstance = {
                        $inject: 'noMutationExpected',
                        noMutationExpected: 0,
                    };

                    const actualMutatableInstance = { ...originalInstance };

                    testUnit.injectByInjectionNames(actualMutatableInstance);

                    expect(actualMutatableInstance)
                        .toEqual(originalInstance);

                });

            });

            describe('when instance property $inject is an array', () => {

                it('should assign injectables according to array $inject', () => {

                    const originalInstance = {
                        $inject: ['$q'],
                        noMutationExpected: 0,
                    };

                    const actualMutatableInstance = { ...originalInstance };

                    testUnit.injectByInjectionNames(actualMutatableInstance);

                    // no property in testType should be overwritten
                    expect(actualMutatableInstance)
                        .toEqual(jasmine.objectContaining(originalInstance));

                    // we expect an injected $q
                    expect(actualMutatableInstance.$q)
                        .toBe($q);

                });

            });

            describe('when instance property $inject is an object', () => {

                it('should map injectables according to object $inject', () => {

                    const originalInstance = {
                        $inject: {
                            remapped$q: '$q',
                        },
                        noMutationExpected: 0,
                    };

                    const actualMutatableInstance = { ...originalInstance };

                    testUnit.injectByInjectionNames(actualMutatableInstance);

                    // no property in testType should be overwritten
                    expect(actualMutatableInstance)
                        .toEqual(jasmine.objectContaining(originalInstance));

                    // we expect an injected $q on property q according to $inject mapping
                    expect(actualMutatableInstance.remapped$q)
                        .toBe($q);

                });

            });

        });

    });

    describe('.injectByStaticInjectionNames(instance)', () => {

        it('should always return the given value of parameter instance', () => {
            const expectedInstance = {};

            expect(testUnit.injectByStaticInjectionNames(expectedInstance))
                .toBe(expectedInstance);
        });

        describe('when value for parameter instance is NOT an object', () => {

            it('should not mutate the value', () => {

                _.forEach(testImmutableValues, (value) => {

                    expect(() => testUnit.injectByStaticInjectionNames(value))
                        .not
                        .toThrow();

                    expect(testUnit.injectByStaticInjectionNames(value))
                        .toBe(value);

                });

            });

        });

        describe('when value for parameter instance is an object', () => {

            describe('when static property $inject is neither an array nor an object', () => {

                it('should not mutate the instance', () => {

                    const expectedInstance = {
                        $inject: 'noMutationExpected',
                        noMutationExpected: 0,
                    };

                    const actualMutatableInstance = { ...expectedInstance };

                    testUnit.injectByStaticInjectionNames(actualMutatableInstance);

                    expect(actualMutatableInstance)
                        .toEqual(expectedInstance);

                });

            });

            describe('when static property $inject is an array', () => {

                it('should assign injectables according to array $inject', () => {

                    class TestType {
                        static $inject = ['$q'];

                        noMutationExpected = 0;
                    }

                    const originalInstance = new TestType();

                    const actualMutatableInstance = new TestType();

                    testUnit.injectByStaticInjectionNames(actualMutatableInstance);

                    // no property in testType should be overwritten
                    expect(actualMutatableInstance)
                        .toEqual(jasmine.objectContaining(originalInstance));

                    // we expect an injected $q
                    expect(actualMutatableInstance.$q)
                        .toBe($q);

                });

            });

            describe('when static property $inject is an object', () => {

                it('should map injectables according to object $inject', () => {

                    class TestType {
                        static $inject = {
                            remapped$q: '$q',
                        };

                        noMutationExpected = 0;
                    }

                    const originalInstance = new TestType();

                    const actualMutatableInstance = new TestType();

                    testUnit.injectByStaticInjectionNames(actualMutatableInstance);

                    // no property in testType should be overwritten
                    expect(actualMutatableInstance)
                        .toEqual(jasmine.objectContaining(originalInstance));

                    // we expect an injected $q on property q according to $inject mapping
                    expect(actualMutatableInstance.remapped$q)
                        .toBe($q);

                });

            });

        });

    });

});
