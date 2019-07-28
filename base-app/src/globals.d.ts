// original DoneFn from @types/jasmine
interface JasmineDoneFn extends Function {
    (): void;
    fail: (message?: Error | string) => void;
}

declare module 'angular-aria' {
    const moduleName = 'ngAria';
    export default moduleName;
}

declare module 'angular-messages' {
    const moduleName = 'ngMessages';
    export default moduleName;
}

declare module 'uuid-browser/v4' {
    const uuidV4: () => string;
    export default uuidV4;
}

declare namespace rx.angular {

    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface IRxScope {
        $eventToObservable<T>(eventName: string): Rx.IObservable<T>;
    }

}
