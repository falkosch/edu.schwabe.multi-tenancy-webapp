import { NavServiceName, NavService } from './nav.service';
import { NavModule } from './nav.module';

describe(`${NavModule}.${NavServiceName}`, () => {

    let navService;

    beforeEach(() => {
        angular.mock.module(NavModule);

        inject((_navService_) => {
            navService = _navService_;
        });
    });

    it(`should be an instanceof ${NavServiceName}`, () => {

        expect(navService)
            .toEqual(jasmine.any(NavService));

    });

    describe('.entries', () => {

        it('should be an array that is empty at first', () => {
            expect(navService.entries)
                .toEqual([]);
        });

    });

    describe('.forState()', () => {

        const data = {
            text: 'test',
            state: 'Test',
        };

        it('should be chainable', () => {

            expect(navService.forState(data.text, data.state))
                .toBe(navService);

        });

        it('should add an object with the "text" and "state" to .entries', () => {

            expect(navService.forState(data.text, data.state).entries)
                .toEqual(jasmine.arrayContaining([
                    jasmine.objectContaining(data),
                ]));

        });

        it('should add one object to .entries at a time', () => {

            expect(navService.entries.length)
                .toEqual(0);

            expect(navService.forState(data.text, data.state).entries.length)
                .toEqual(1);

            expect(navService.forState(data.text, data.state).entries.length)
                .toEqual(2);

        });

    });

});
