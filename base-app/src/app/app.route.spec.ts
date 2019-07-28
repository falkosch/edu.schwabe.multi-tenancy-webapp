import _ from 'lodash';
import angular from 'angular';
import uiRouter, { StateProvider } from '@uirouter/angularjs';

import { AppModule } from './app.module';
import { AppStateId, appRoute } from './app.route';
import { LanguageServiceName, LanguageService } from '../core/language/language.service';

describe(`${AppModule} route config`, () => {

    let $stateProviderMock: jasmine.SpyObj<StateProvider>;
    let languageServiceMock: jasmine.SpyObj<LanguageService>;

    let $injector: angular.auto.IInjectorService;
    let $q: angular.IQService;

    beforeEach(() => {

        languageServiceMock = {
            onReady: jasmine.createSpy('onReady'),
        } as any;

        angular.mock.module(uiRouter, ($stateProvider: StateProvider) => {
            $stateProviderMock = $stateProvider as any;
            spyOn($stateProviderMock, 'state');
        });

        angular.mock.module(AppModule, {
            [LanguageServiceName]: languageServiceMock,
        });

        inject((_$injector_, _$q_) => {
            $injector = _$injector_;
            $q = _$q_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$stateProvider',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(appRoute)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it(`should setup state ${AppStateId}`, () => {

        expect($stateProviderMock.state)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                name: AppStateId,
            }));

    });

    describe(`${AppStateId} resolve`, () => {

        const resolvers = [
            'languageReady',
        ];

        let resolve: { languageReady: [string, Function] };

        beforeEach(() => {
            resolve = _.get(
                $stateProviderMock.state.calls.first(),
                'args.0.resolve',
            );
        });

        it(`should only have resolvers ${resolvers.join(',')}`, () => {
            expect(_.sortBy(_.keys(resolve)))
                .toEqual(_.sortBy(resolvers));
        });

        describe('.languageReady', () => {

            const resolverInjects = [
                LanguageServiceName,
            ];

            let resolver: [string, Function];
            let resolverFn: Function;

            beforeEach(() => {
                resolver = resolve.languageReady;
                [, resolverFn] = resolver;
            });

            it(`should only depend on ${resolverInjects.join(',')}`, () => {
                expect(_.sortBy($injector.annotate(resolver)))
                    .toEqual(_.sortBy(resolverInjects));
            });

            it('should return the promise for the waiting until language services are ready', () => {
                const promise = $q.resolve();
                languageServiceMock.onReady
                    .and.returnValue(promise);

                expect(
                    resolverFn(languageServiceMock),
                ).toEqual(promise);
            });

        });

    });

});
