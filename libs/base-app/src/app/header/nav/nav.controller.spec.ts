import _ from 'lodash';
import angular from 'angular';

import { NavModule } from './nav.module';
import { NavController } from './nav.controller';
import { NavComponentName } from './nav.component';
import { NavigationServiceName, NavigationService } from '../../../core/navigation/navigation.service';

describe(`${NavModule}.${NavComponentName} controller`, () => {

    let testUnit: NavController;

    let navigationServiceMock: NavigationService;
    let sideNavMock: Partial<angular.material.ISidenavObject>;

    let $componentController: angular.IComponentControllerService;
    let $injector: angular.auto.IInjectorService;
    let $rootScope: angular.IRootScopeService;

    beforeEach(() => {

        navigationServiceMock = {
            entries: [
                {
                    translationKey: 'test',
                    state: 'Test',
                },
            ],
            forState: jasmine.createSpy().and.throwError('test failure'),
        };

        sideNavMock = {
            close: jasmine.createSpy('close'),
        };

        angular.mock.module(NavModule);

        inject((_$injector_, _$rootScope_, _$componentController_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            $componentController = _$componentController_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$scope',
            NavigationServiceName,
        ];

        beforeEach(() => {
            testUnit = $componentController(
                NavComponentName,
                {
                    [NavigationServiceName]: navigationServiceMock,
                },
                {
                    sideNav: sideNavMock,
                },
            );
        });

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

        beforeEach(() => {
            testUnit = $componentController(
                NavComponentName,
                {
                    [NavigationServiceName]: navigationServiceMock,
                },
                {
                    sideNav: sideNavMock,
                },
            );
        });

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
                testUnit = $componentController(
                    NavComponentName,
                    {
                        [NavigationServiceName]: navigationServiceMock,
                    },
                    {
                        sideNav: undefined,
                    },
                );
            });

            it('should NOT magically close side navigation', () => {
                expect(() => testUnit.onClickNavLink())
                    .not.toThrow();

                expect(sideNavMock.close)
                    .toHaveBeenCalledTimes(0);
            });

        });

        describe('when side navigation is available', () => {

            beforeEach(() => {
                testUnit = $componentController(
                    NavComponentName,
                    {
                        [NavigationServiceName]: navigationServiceMock,
                    },
                    {
                        sideNav: sideNavMock,
                    },
                );
            });

            it('should close side navigation', () => {
                expect(() => testUnit.onClickNavLink())
                    .not.toThrow();

                expect(sideNavMock.close)
                    .toHaveBeenCalledTimes(1);
            });

        });


    });

});
