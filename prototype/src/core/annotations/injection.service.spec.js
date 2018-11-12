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

    describe('.injectByStaticInjectionNames', () => {

        it('should noop when parameter "type" is not an object', () => {

            /*
             * Obviously, this is difficult to test with an expect that the given types were not
             * mutated. We simply assume that no thrown JS errors in these cases is good enough.
             */

            injectionService.injectByStaticInjectionNames(undefined);
            injectionService.injectByStaticInjectionNames(null);
            injectionService.injectByStaticInjectionNames(0);
            injectionService.injectByStaticInjectionNames(1);
            injectionService.injectByStaticInjectionNames(0.1);
            injectionService.injectByStaticInjectionNames('');

        });

        it('should noop when parameter "type" is an object but has no array or object on its $inject property', () => {

            const originalTestType = {
                $inject: '$q',
            };

            const copyTestType = { ...originalTestType };

            injectionService.injectByStaticInjectionNames(copyTestType);

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

            injectionService.injectByStaticInjectionNames(testType);

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

            injectionService.injectByStaticInjectionNames(testType);

            // no property in testType should be overwritten
            expect(testType)
                .toEqual(jasmine.objectContaining(originalTestType));

            // we expect an injected $q on property q according to $inject mapping
            expect(testType.q)
                .toBe($q);

        });

    });

});
