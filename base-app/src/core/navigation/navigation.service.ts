export const NavigationServiceName = 'navigationService';

export interface NavigationEntry {
    translationKey: string;
    state: string;
}

export class NavigationService {

    public entries: NavigationEntry[] = [];

    /**
     * @param translationKey translation key of a human-readable text for the link
     * @param state ui-sref target
     */
    public forState(translationKey: string, state: string): NavigationService {
        this.entries = [
            ...this.entries,
            {
                translationKey,
                state,
            },
        ];

        return this;
    }
}
