import angular from 'angular';

import { AnnotationsModule } from './annotations.module';
import { InjectionServiceName, InjectionService } from './injection.service';

describe(`${AnnotationsModule}.${InjectionServiceName}`, () => {

    let $q;
    let injectionService;

    beforeEach(() => {

        angular.mock.module(AnnotationsModule);

        inject((_$q_, _injectionService_) => {
            $q = _$q_;
            injectionService = _injectionService_;
        });

    });

    it(`should be an instanceof ${InjectionServiceName}`, () => {

        expect(injectionService)
            .toEqual(jasmine.any(InjectionService));

    });

    describe('.injectByInjectionNames', () => {

        it('should noop when parameter "instance" is not an object', () => {

            /*
             * Obviously, this is difficult to test with an expect that the given types were not
             * mutated. We simply assume that there should be no thrown JS errors in these cases
             * is good enough.
             */

            expect(() => injectionService.injectByInjectionNames(undefined))
                .not.toThrow();

            expect(() => injectionService.injectByInjectionNames(null))
                .not.toThrow();

            // Primitive values and strings cannot be mutated, but we expect no errors either

            expect(() => injectionService.injectByInjectionNames(0))
                .not.toThrow();

            expect(() => injectionService.injectByInjectionNames(1))
                .not.toThrow();

            expect(() => injectionService.injectByInjectionNames(0.1))
                .not.toThrow();

            expect(() => injectionService.injectByInjectionNames(''))
                .not.toThrow();

        });

        it('should noop when parameter "instance" is an object but has no array or object on its $inject property', () => {

            const originalTestType = {
                $inject: '$q',
            };

            const copyTestType = { ...originalTestType };

            injectionService.injectByInjectionNames(copyTestType);

            expect(copyTestType)
                .toEqual(originalTestType);

        });

        it('should put injectables on the given object according to its array $inject', () => {

            const originalTestType = {
                $inject: ['$q'],
                a: 0,
                test: angular.noop,
            };

            const testType = { ...originalTestType };

            injectionService.injectByInjectionNames(testType);

            // no property in testType should be overwritten
            expect(testType)
                .toEqual(jasmine.objectContaining(originalTestType));

            // we expect an injected $q
            expect(testType.$q)
                .toBe($q);

        });

        it('should put injectables on the given object according to its object $inject', () => {

            const originalTestType = {
                $inject: {
                    q: '$q',
                },
                a: 0,
                test: angular.noop,
            };

            const testType = { ...originalTestType };

            injectionService.injectByInjectionNames(testType);

            // no property in testType should be overwritten
            expect(testType)
                .toEqual(jasmine.objectContaining(originalTestType));

            // we expect an injected $q on property q according to $inject mapping
            expect(testType.q)
                .toBe($q);

        });

    });

});
