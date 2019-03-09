import _ from 'lodash';
import angular from 'angular';
import 'angular-mocks';
import angularTranslate from 'angular-translate';

beforeAll(() => {

    let $q;

    const $translateMock = jasmine.createSpy()
        .and
        .callFake(keys => $q.resolve(_.zipObject(keys, keys)));
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
