declare namespace NodeJS {

    interface Global {
        caches: {
            delete(id: string): Promise<any>;
            keys(): Promise<string[]>;
            match(request: Request | string): Promise<Response>;
            open(id: string): Promise<Cache>;
        };
        location: URL;
        serviceWorkerOption: {
            assets: string[];
        };
    }

}

interface Event {
    request: Request;
    respondWith(response: Promise<any>): void;
    waitUntil(arg0: Promise<any>): void;
}

declare module 'serviceworker-webpack-plugin/lib/runtime' { }
