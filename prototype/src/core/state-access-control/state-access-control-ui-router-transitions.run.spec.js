import _ from 'lodash';
import angular from 'angular';

import { StateAccessControlModule } from './state-access-control.module';
import { StateAccessControlServiceName } from './state-access-control.service';
import { stateAccessControlUiRouterTransitionsRun, onBeforeHookBuilder } from './state-access-control-ui-router-transitions.run';

describe(`${StateAccessControlModule} ui router transitions run`, () => {

    let $transitionsMock;
    let stateAccessControlServiceMock;

    let $injector;

    beforeEach(() => {

        $transitionsMock = {
            onBefore: jasmine.createSpy('onBefore'),
        };

        stateAccessControlServiceMock = {
            authorize: jasmine.createSpy('authorize'),
        };

        angular.mock.module(StateAccessControlModule, {
            $transitions: $transitionsMock,
            [StateAccessControlServiceName]: stateAccessControlServiceMock,
        });

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$transitions',
            StateAccessControlServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(stateAccessControlUiRouterTransitionsRun)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it('should register an onBefore transition hook', () => {

        expect($transitionsMock.onBefore)
            .toHaveBeenCalledWith(jasmine.anything(), jasmine.any(Function));

    });

    describe('onBefore hook', () => {

        const testTransition = {};

        let onBeforeHook;

        beforeEach(() => {
            onBeforeHook = onBeforeHookBuilder(stateAccessControlServiceMock);
        });

        it(`should authorize state access via ${StateAccessControlServiceName}`, () => {
            onBeforeHook(testTransition);

            expect(stateAccessControlServiceMock.authorize)
                .toHaveBeenCalledWith(testTransition);
        });

    });

});
