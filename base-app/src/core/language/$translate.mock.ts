import _ from 'lodash';
import angular from 'angular';
import 'angular-mocks';
import angularTranslate from 'angular-translate';

beforeAll(() => {

    let $q: angular.IQService;

    const $translateMock: any = jasmine.createSpy()
        .withArgs(jasmine.any(Array))
        .and.callFake(keys => $q.resolve(_.zipObject(keys, keys)))
        .withArgs(jasmine.any(String))
        .and.callFake(_.identity);

    $translateMock.preferredLanguage = jasmine.createSpy();
    $translateMock.storage = jasmine.createSpy();
    $translateMock.storageKey = jasmine.createSpy();

    angular.mock.module(angularTranslate, {
        $translate: $translateMock,
    });

    inject((_$q_) => {
        $q = _$q_;
    });

});
