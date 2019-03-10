import _ from 'lodash';
import angular from 'angular';

import { NavigationServiceName, NavigationService } from './navigation.service';
import { NavigationModule } from './navigation.module';

describe(`${NavigationModule}.${NavigationServiceName}`, () => {

    let testUnit;

    let $injector;

    beforeEach(() => {

        angular.mock.module(NavigationModule);

        inject((_$injector_) => {
            $injector = _$injector_;

            testUnit = $injector.get(NavigationServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(NavigationService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${NavigationService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(NavigationService));
        });

    });

    describe('.entries', () => {

        it('should be an array that is empty at first', () => {
            expect(testUnit.entries)
                .toEqual([]);
        });

    });

    describe('.forState()', () => {

        const data = {
            translationKey: 'test',
            state: 'Test',
        };

        it('should be chainable', () => {
            expect(testUnit.forState(data.translationKey, data.state))
                .toBe(testUnit);
        });

        it('should add an object with the "text" and "state" to .entries', () => {
            testUnit.forState(data.translationKey, data.state);

            expect(testUnit.entries)
                .toEqual(jasmine.arrayContaining([
                    jasmine.objectContaining(data),
                ]));
        });

        it('should add one object to .entries at a time', () => {
            expect(testUnit.entries.length)
                .toEqual(0);

            testUnit.forState(data.translationKey, data.state);

            expect(testUnit.entries.length)
                .toEqual(1);

            testUnit.forState(data.translationKey, data.state);

            expect(testUnit.entries.length)
                .toEqual(2);

        });

    });

});
