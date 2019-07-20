declare const VERSION: string;

declare module '*.html' {
    const value: string;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}

declare module '*.webp' {
    const value: string;
    export default value;
}

interface Context {
    keys(): string[];
    (key: string): any;
}

interface NodeRequire {
    context(directory: string, includeSubdirs: boolean, filter: RegExp): Context;
}
