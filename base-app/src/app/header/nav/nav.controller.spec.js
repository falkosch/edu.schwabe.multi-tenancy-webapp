import _ from 'lodash';
import angular from 'angular';

import { NavModule } from './nav.module';
import { NavController } from './nav.controller';
import { NavComponentName } from './nav.component';
import { NavigationServiceName } from '../../../core/navigation/navigation.service';

describe(`${NavModule}.${NavComponentName} controller`, () => {

    let testUnit;

    let navigationServiceMock;
    let sideNavMock;

    let $injector;
    let $rootScope;

    beforeEach(() => {

        navigationServiceMock = {
            entries: [
                {
                    text: 'test',
                    state: 'Test',
                },
            ],
        };

        sideNavMock = {
            close: jasmine.createSpy('close'),
        };

        angular.mock.module(NavModule);

        inject((_$injector_, _$rootScope_, $componentController) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;

            testUnit = $componentController(
                NavComponentName,
                {
                    [NavigationServiceName]: navigationServiceMock,
                },
            );
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$scope',
            NavigationServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(NavController)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${NavController.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(NavController));
        });

    });

    describe('when component is initialized', () => {

        it(`should put ${NavigationServiceName}.entries on its instance`, () => {

            testUnit.$onInit();
            $rootScope.$digest();

            expect(testUnit.entries)
                .toEqual(navigationServiceMock.entries);

        });

    });

    describe('.onClickNavLink()', () => {

        describe('when side navigation is NOT available', () => {

            beforeEach(() => {
                testUnit.sideNav = undefined;
            });

            it('should NOT magically close side navigation', () => {
                expect(() => testUnit.onClickNavLink())
                    .not
                    .toThrow();

                expect(sideNavMock.close)
                    .toHaveBeenCalledTimes(0);
            });

        });

        describe('when side navigation is available', () => {

            beforeEach(() => {
                testUnit.sideNav = sideNavMock;
            });

            it('should close side navigation', () => {
                expect(() => testUnit.onClickNavLink())
                    .not
                    .toThrow();

                expect(sideNavMock.close)
                    .toHaveBeenCalledTimes(1);
            });

        });


    });

});
