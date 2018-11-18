import { MockBackendModule } from './mock-backend.module';

import { MockProfileServiceName, MockProfileService } from './mock-profile.service';

describe(`${MockBackendModule}.${MockProfileServiceName}`, () => {

    const testData = _getTestData();

    let $httpBackend;
    let authRequestHandler;
    let profileService;
    let mockProfilesUrl;

    beforeEach(() => {

        angular.mock.module(MockBackendModule);

        inject((_$httpBackend_, _profileService_, _mockProfilesUrl_) => {
            $httpBackend = _$httpBackend_;
            profileService = _profileService_;
            mockProfilesUrl = _mockProfilesUrl_;

            authRequestHandler = $httpBackend
                .when('GET', mockProfilesUrl)
                .respond(testData);

        });

    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it(`should be an instanceof ${MockProfileServiceName}`, () => {
        $httpBackend.expectGET(mockProfilesUrl);

        expect(profileService)
            .toEqual(jasmine.any(MockProfileService));

        $httpBackend.flush();
    });

    function _getTestData() {
        /* eslint-disable comma-dangle, quote-props, quotes */
        return {
            "results": [
                {
                    "gender": "female",
                    "name": {
                        "title": "mrs",
                        "first": "sophie",
                        "last": "mackay"
                    },
                    "location": {
                        "street": "6503 elgin st",
                        "city": "grand falls",
                        "state": "ontario",
                        "postcode": "O0A 7G7",
                        "coordinates": {
                            "latitude": "-62.4843",
                            "longitude": "166.3585"
                        },
                        "timezone": {
                            "offset": "0:00",
                            "description": "Western Europe Time, London, Lisbon, Casablanca"
                        }
                    },
                    "email": "sophie.mackay@example.com",
                    "login": {
                        "uuid": "f9a7a76a-f5e6-449d-a4c8-836cb7c7786c",
                        "username": "orangeleopard313",
                        "password": "seviyi",
                        "salt": "x6ypJZkp",
                        "md5": "1c296118246d2c2a076d2a0f1adf2f9e",
                        "sha1": "f724cf401862893fba37c15f753ec7052f909c3a",
                        "sha256": "1cfd57affe5d8b0c209aabb3a4f3dfcfa49f933be4cf5ed03b4770447100403e"
                    },
                    "dob": {
                        "date": "1967-03-16T04:12:26Z",
                        "age": 51
                    },
                    "registered": {
                        "date": "2014-11-27T00:23:28Z",
                        "age": 3
                    },
                    "phone": "484-454-7123",
                    "cell": "688-995-6701",
                    "id": {
                        "name": "",
                        "value": null
                    },
                    "picture": {
                        "large": "https://randomuser.me/api/portraits/women/67.jpg",
                        "medium": "https://randomuser.me/api/portraits/med/women/67.jpg",
                        "thumbnail": "https://randomuser.me/api/portraits/thumb/women/67.jpg"
                    },
                    "nat": "CA"
                },
                {
                    "gender": "female",
                    "name": {
                        "title": "miss",
                        "first": "amalie",
                        "last": "poulsen"
                    },
                    "location": {
                        "street": "8071 fjordparken",
                        "city": "stenderup",
                        "state": "danmark",
                        "postcode": 74762,
                        "coordinates": {
                            "latitude": "-58.3510",
                            "longitude": "-100.8464"
                        },
                        "timezone": {
                            "offset": "+5:00",
                            "description": "Ekaterinburg, Islamabad, Karachi, Tashkent"
                        }
                    },
                    "email": "amalie.poulsen@example.com",
                    "login": {
                        "uuid": "69ddee8a-c028-400b-bb4c-0d3bc3c1bea9",
                        "username": "greenbird487",
                        "password": "hippo",
                        "salt": "4OJfWdFB",
                        "md5": "53bd4bbe0646929f76460d525d7e85da",
                        "sha1": "5a1ac6d5cfd45e7fc526da6e14f382ed8f09e177",
                        "sha256": "056fd8f0f44087106f5c7f9b9ac4a3a566a7695595318a3d48170f012b36054d"
                    },
                    "dob": {
                        "date": "1966-05-20T11:15:37Z",
                        "age": 52
                    },
                    "registered": {
                        "date": "2002-08-21T18:11:26Z",
                        "age": 16
                    },
                    "phone": "08129150",
                    "cell": "79369439",
                    "id": {
                        "name": "CPR",
                        "value": "876799-8643"
                    },
                    "picture": {
                        "large": "https://randomuser.me/api/portraits/women/92.jpg",
                        "medium": "https://randomuser.me/api/portraits/med/women/92.jpg",
                        "thumbnail": "https://randomuser.me/api/portraits/thumb/women/92.jpg"
                    },
                    "nat": "DK"
                },
                {
                    "gender": "female",
                    "name": {
                        "title": "miss",
                        "first": "samantha",
                        "last": "robinson"
                    },
                    "location": {
                        "street": "1158 strand road",
                        "city": "gorey",
                        "state": "dún laoghaire–rathdown",
                        "postcode": 44191,
                        "coordinates": {
                            "latitude": "-73.1917",
                            "longitude": "102.7710"
                        },
                        "timezone": {
                            "offset": "+4:30",
                            "description": "Kabul"
                        }
                    },
                    "email": "samantha.robinson@example.com",
                    "login": {
                        "uuid": "08675166-0f1d-424f-a80b-f5ae75fdcacf",
                        "username": "silverfrog474",
                        "password": "stinker",
                        "salt": "y2NbGky6",
                        "md5": "2cbfb3d9a13dd34818cdac03a0e7ed10",
                        "sha1": "0db44cd59a2b13a2bea3249d9259a42229cf949e",
                        "sha256": "0a66a5686ca8673736a6c733e22f323916784bef51e1833a58589aa203592a32"
                    },
                    "dob": {
                        "date": "1974-01-27T06:17:31Z",
                        "age": 44
                    },
                    "registered": {
                        "date": "2002-10-26T07:31:42Z",
                        "age": 16
                    },
                    "phone": "061-109-0596",
                    "cell": "081-798-0598",
                    "id": {
                        "name": "PPS",
                        "value": "8604516T"
                    },
                    "picture": {
                        "large": "https://randomuser.me/api/portraits/women/17.jpg",
                        "medium": "https://randomuser.me/api/portraits/med/women/17.jpg",
                        "thumbnail": "https://randomuser.me/api/portraits/thumb/women/17.jpg"
                    },
                    "nat": "IE"
                }
            ],
            "info": {
                "seed": "webapps-prototype",
                "results": 3,
                "page": 1,
                "version": "1.2"
            }
        };
        /* eslint-enable */
    }

});
