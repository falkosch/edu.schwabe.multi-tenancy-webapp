import { Ng1ViewDeclaration, _Ng1StateDeclaration, StateObject } from '@uirouter/angularjs';

/**
 * @hidden otherwise this module will be visible in the typedoc output
 */
declare module '@uirouter/angularjs' {

    type BuilderFunction = (state: StateObject, argParent?: BuilderFunction) => any;

    interface StateObject {
        accessControl?: Record<string, any>;
    }

    interface Ng1StateDeclaration extends _Ng1StateDeclaration, Ng1ViewDeclaration {
        accessControl?: Record<string, any>;
    }

    interface StateProvider {
        decorator(argName: string, func: BuilderFunction): Function | this | BuilderFunction[];
        state(definition: Ng1StateDeclaration): StateProvider;
    }

}
