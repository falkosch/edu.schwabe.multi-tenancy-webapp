import _ from 'lodash';
import angular from 'angular';

import { AnnotationsModule } from './annotations.module';
import { InjectionServiceName, InjectionService } from './injection.service';

describe(`${AnnotationsModule}.${InjectionServiceName}`, () => {

    let testUnit: InjectionService;

    let $q: angular.IQService;
    let $injector: angular.auto.IInjectorService;

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
            class TestType {
                public $inject = [];
            }
            const expectedInstance = new TestType();

            expect(testUnit.injectByInjectionNames(expectedInstance))
                .toBe(expectedInstance);
        });

        describe('when instance property $inject is an array', () => {

            it('should assign injectables according to array $inject', () => {

                class TestType {
                    public $inject = ['$q'];

                    public noMutationExpected = 0;

                    public $q?: angular.IQService;
                }

                const originalInstance = new TestType();
                const actualMutatableInstance = new TestType();

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

                class TestType {
                    public $inject = {
                        remapped$q: '$q',
                    };

                    public noMutationExpected = 0;

                    public remapped$q?: angular.IQService;
                }

                const originalInstance = new TestType();
                const actualMutatableInstance = new TestType();

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

    describe('.injectByStaticInjectionNames(instance)', () => {

        it('should always return the given value of parameter instance', () => {
            class TestType {
                public static $inject = [];
            }
            const expectedInstance = new TestType();

            expect(testUnit.injectByStaticInjectionNames(expectedInstance))
                .toBe(expectedInstance);
        });

        describe('when static property $inject is an array', () => {

            it('should assign injectables according to array $inject', () => {

                class TestType {
                    public static $inject = ['$q'];

                    public noMutationExpected = 0;

                    public $q?: angular.IQService;
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
                    public static $inject = {
                        remapped$q: '$q',
                    };

                    public noMutationExpected = 0;

                    public remapped$q?: angular.IQService;
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
