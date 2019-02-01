import angular from 'angular';

import { NavigationServiceName, NavigationService } from './navigation.service';
import { NavigationModule } from './navigation.module';

describe(`${NavigationModule}.${NavigationServiceName}`, () => {

    let navigationService;

    beforeEach(() => {

        angular.mock.module(NavigationModule);

        inject((_navigationService_) => {
            navigationService = _navigationService_;
        });

    });

    it(`should be an instanceof ${NavigationServiceName}`, () => {

        expect(navigationService)
            .toEqual(jasmine.any(NavigationService));

    });

    describe('.entries', () => {

        it('should be an array that is empty at first', () => {

            expect(navigationService.entries)
                .toEqual([]);

        });

    });

    describe('.forState()', () => {

        const data = {
            text: 'test',
            state: 'Test',
        };

        it('should be chainable', () => {

            expect(navigationService.forState(data.text, data.state))
                .toBe(navigationService);

        });

        it('should add an object with the "text" and "state" to .entries', () => {

            expect(navigationService.forState(data.text, data.state).entries)
                .toEqual(jasmine.arrayContaining([
                    jasmine.objectContaining(data),
                ]));

        });

        it('should add one object to .entries at a time', () => {

            expect(navigationService.entries.length)
                .toEqual(0);

            expect(navigationService.forState(data.text, data.state).entries.length)
                .toEqual(1);

            expect(navigationService.forState(data.text, data.state).entries.length)
                .toEqual(2);

        });

    });

});
