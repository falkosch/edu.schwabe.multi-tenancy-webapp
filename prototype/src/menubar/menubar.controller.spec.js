import { MenubarModule } from './menubar.module';
import { MenubarName } from './menubar.component';
import { MenubarController } from './menubar.controller';

describe(`${MenubarModule}.${MenubarName} component controller`, () => {

    const $stateMockWithTitle = {
        current: {
            data: {
                title: 'mocked',
            },
            name: 'mockedName',
        },
    };

    const $stateMockWithOnlyName = {
        current: {
            name: 'mockedOnlyName',
        },
    };

    let menubarController;

    beforeEach(() => {

        angular.mock.module(MenubarModule);

    });

    it(`should be an instanceof ${MenubarName} component controller`, () => {

        inject(($componentController) => {

            menubarController = $componentController(MenubarName, {
                $state: $stateMockWithTitle,
            });

            expect(menubarController)
                .toEqual(jasmine.any(MenubarController));

        });

    });

    describe('.currentStateTitle', () => {

        it('should return a string of a current state title', () => {

            inject(($componentController) => {

                menubarController = $componentController(MenubarName, {
                    $state: $stateMockWithTitle,
                });

                expect(menubarController.currentStateTitle)
                    .toEqual(jasmine.any(String));

            });

        });

        it('should not return the state name when there is a "data.title" set', () => {

            inject(($componentController) => {

                menubarController = $componentController(MenubarName, {
                    $state: $stateMockWithTitle,
                });

                expect(menubarController.currentStateTitle)
                    .toEqual($stateMockWithTitle.current.data.title);

                expect(menubarController.currentStateTitle)
                    .not.toEqual($stateMockWithTitle.current.name);

                expect(menubarController.currentStateTitle)
                    .not.toEqual($stateMockWithOnlyName.current.name);

            });

        });

        it('should return the state name when there is no "data.title" set', () => {

            inject(($componentController) => {

                menubarController = $componentController(MenubarName, {
                    $state: $stateMockWithOnlyName,
                });

                expect(menubarController.currentStateTitle)
                    .toEqual($stateMockWithOnlyName.current.name);

                expect(menubarController.currentStateTitle)
                    .not.toEqual($stateMockWithTitle.current.data.title);

                expect(menubarController.currentStateTitle)
                    .not.toEqual($stateMockWithTitle.current.name);

            });

        });

    });

});
