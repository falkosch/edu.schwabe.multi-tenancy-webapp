import { InjectionService, TypeConstructor } from '../../annotations/injection.service';
import { UserState } from './user-state.model';

export const ContextInjectName = 'context';

export class Context {

    public constructor(
        private injectionService: InjectionService,
        private userStateGetter: () => UserState,
        private userStateSetter: (value: UserState) => void,
    ) { }

    public nextUserState<T extends UserState>(
        userStateTypeContructor: TypeConstructor<T>,
        locals?: Record<string, any>,
    ): T {
        const newUserState = this.injectionService.injectByTypeConstructor(
            userStateTypeContructor, {
                ...locals,
                [ContextInjectName]: this,
            },
        );

        this.userStateSetter(newUserState);

        return newUserState;
    }

    public get userState(): UserState {
        return this.userStateGetter();
    }
}
