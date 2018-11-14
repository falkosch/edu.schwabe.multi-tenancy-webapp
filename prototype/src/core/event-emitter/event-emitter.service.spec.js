import { EventEmitterServiceName, EventEmitterService } from './event-emitter.service';
import { EventEmitterModule } from './event-emitter.module';

describe(`${EventEmitterModule}.${EventEmitterServiceName}`, () => {

    let eventEmitterService;

    beforeEach(() => {

        angular.mock.module(EventEmitterModule);

        inject((_eventEmitterService_) => {
            eventEmitterService = _eventEmitterService_;
        });

    });

    it(`should be an instanceof ${EventEmitterServiceName}`, () => {

        expect(eventEmitterService)
            .toEqual(jasmine.any(EventEmitterService));

    });

});
