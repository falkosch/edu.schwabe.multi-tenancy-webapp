import _ from 'lodash';

export const ASSETS = [
    'test1',
    'test2',
];

// We have to spy on API functionality before we can make use of jasmine spies,
// because the service worker code will execute right after this code and execution
// cannot be postponed to later when jasmine is scheduling the it-tests.
export class SpyData {

    public strategy = (...args: any[]): any => this.passthrough(...args);

    private original: Function;

    private calls: any[][] = [];

    public constructor(obj: any, methodName: string) {
        this.original = obj[methodName];
        // eslint-disable-next-line no-param-reassign
        obj[methodName] = (...args: any[]) => this.spyCall(args);
    }

    private spyCall(args: any[]): any {
        this.recordCall(args);
        return this.strategy(...args);
    }

    private recordCall(args: any[]): void {
        this.calls.push(args);
    }

    public toHaveBeenCalledWith(...argsSample: any[]): boolean {
        return !_.isEmpty(this.lastCalls(...argsSample));
    }

    public lastCalls(...argsSample: any[]): any[][] {
        return _.filter(
            this.calls,
            (callArgs) => _.isEqual(argsSample, _.slice(callArgs, 0, _.size(argsSample))),
        );
    }

    public lastCall(...argsSample: any[]): any[] | undefined {
        return _.last(this.lastCalls(...argsSample));
    }

    public resetCalls(): void {
        this.calls = [];
    }

    public resetStrategy(): void {
        this.strategy = (...args: any[]) => this.passthrough(...args);
    }

    public resetSpy(): void {
        this.resetCalls();
        this.resetStrategy();
    }

    public passthrough(...args: any[]): any {
        const { original } = this;
        return original(...args);
    }
}

export const SPIES = {
    fetch: new SpyData(self, 'fetch'),
    addEventListener: new SpyData(self, 'addEventListener'),
    caches: {
        delete: new SpyData(self.caches, 'delete'),
        keys: new SpyData(self.caches, 'keys'),
        match: new SpyData(self.caches, 'match'),
        open: new SpyData(self.caches, 'open'),
    },
};

global.serviceWorkerOption = {
    assets: ASSETS,
};
