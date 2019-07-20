export function registerAppServiceWorkerRuntime({ default: runtime }: any): void {
    runtime.register();
}

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    import('serviceworker-webpack-plugin/lib/runtime')
        .then(registerAppServiceWorkerRuntime);
}
