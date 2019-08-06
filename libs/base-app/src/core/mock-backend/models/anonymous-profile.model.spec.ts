import { MockBackendModule } from '../mock-backend.module';
import { AnonymousProfile } from './anonymous-profile.model';

describe(`${MockBackendModule}.models.${AnonymousProfile.name}`, () => {

    const testUserId = 'TEST';

    let testUnit: AnonymousProfile;

    beforeEach(() => {
        testUnit = new AnonymousProfile(testUserId);
    });

    describe('.constructor(userId)', () => {

        it('should set an initial user id', () => {
            expect(testUnit.login.uuid)
                .toBe(testUserId);
        });

    });

});
