declare const VERSION: string;

/** Language properties for the app set in its project properties in the package.json */
interface LanguageProjectProperties {
    allAvailable: string[];
    fallback: string;
    default: string;
    partialsUrlTemplate: string;
    dynamicLocalesUrlTemplate: string;
}

/** Project properties for the app set in its package.json */
interface ProjectProperties {
    /**
     * name of the entry module, which determines the entry file and what AngularJS module to
     * bootstrap with
     */
    entryModule: string;
    /** informal short name of the app */
    shortName: string;
    /** customization of the language configuration for the base-app */
    language: LanguageProjectProperties;
}
declare const PROJECT_PROPERTIES: ProjectProperties;

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
