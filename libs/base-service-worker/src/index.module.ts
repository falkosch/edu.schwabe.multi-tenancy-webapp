export function registerAppServiceWorkerRuntime({ default: runtime }: any): void {
    runtime.register();
}

if ('serviceWorker' in navigator) {
    import('serviceworker-webpack-plugin/lib/runtime')
        .then(registerAppServiceWorkerRuntime);
}
