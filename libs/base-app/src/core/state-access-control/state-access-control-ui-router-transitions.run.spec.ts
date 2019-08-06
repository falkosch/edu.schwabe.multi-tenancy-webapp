import _ from 'lodash';
import angular from 'angular';
import { TransitionService, TransitionHookFn, Transition } from '@uirouter/core';

import { StateAccessControlModule } from './state-access-control.module';
import { StateAccessControlServiceName, StateAccessControlService } from './state-access-control.service';
import { stateAccessControlUiRouterTransitionsRun, onBeforeHookBuilder } from './state-access-control-ui-router-transitions.run';
import { AllowanceAccessValue } from './models/allowance-access-value.model';

describe(`${StateAccessControlModule} ui router transitions run`, () => {

    let $transitionsMock: TransitionService;
    let stateAccessControlServiceMock: jasmine.SpyObj<StateAccessControlService>;

    let $injector: angular.auto.IInjectorService;
    let $q: angular.IQService;

    beforeEach(() => {

        $transitionsMock = {
            onBefore: jasmine.createSpy('onBefore'),
        } as any;

        stateAccessControlServiceMock = {
            authorize: jasmine.createSpy('authorize'),
        } as any;

        angular.mock.module(StateAccessControlModule, {
            $transitions: $transitionsMock,
            [StateAccessControlServiceName]: stateAccessControlServiceMock,
        });

        inject((_$injector_, _$q_) => {
            $injector = _$injector_;
            $q = _$q_;
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

        const testTransition: Transition = {} as any;

        let onBeforeHook: TransitionHookFn;

        beforeEach(() => {
            stateAccessControlServiceMock.authorize
                .and.returnValue($q.resolve(new AllowanceAccessValue()));
            onBeforeHook = onBeforeHookBuilder(stateAccessControlServiceMock);
        });

        it(`should authorize state access via ${StateAccessControlServiceName}`, () => {
            onBeforeHook(testTransition);

            expect(stateAccessControlServiceMock.authorize)
                .toHaveBeenCalledWith(testTransition);
        });

    });

});
