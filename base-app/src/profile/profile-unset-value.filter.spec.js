import _ from 'lodash';
import angular from 'angular';

import { ProfileModule } from './profile.module';
import { ProfileUnsetValueFilter, ProfileUnsetValueFilterName } from './profile-unset-value.filter';

describe(`${ProfileModule} unset value filter`, () => {

    let testUnit;

    let $injector;

    beforeEach(() => {

        angular.mock.module(ProfileModule);

        inject((_$injector_) => {
            $injector = _$injector_;

            testUnit = $injector.get(ProfileUnsetValueFilterName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(ProfileUnsetValueFilter)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    describe('filterProfileUnsetValue()', () => {

        const expectedNotSetRepresentation = '<not set>';

        describe('when input is nil', () => {

            const testNilInputs = [undefined, null];

            it('should return the "<not set>" representation', () => {
                _.forEach(testNilInputs, (v) => {
                    expect(testUnit(v))
                        .toEqual(expectedNotSetRepresentation);
                });
            });

        });

        describe('when input is NOT nil', () => {

            const testNonNilObjectWithToString = {
                toString() {
                    return 'testString';
                },
            };

            const testNonNilInputs = [0, 1, 0.1, '', 'test', String(), String(''), String('test'), {}, testNonNilObjectWithToString];

            it('should return the string representation of that value', () => {
                _.forEach(testNonNilInputs, (v) => {
                    expect(testUnit(v))
                        .toEqual(String(v));
                });
            });

        });

    });

});
