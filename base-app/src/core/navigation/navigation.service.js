export const NavigationServiceName = 'navigationService';

export class NavigationService {

    entries = [];

    /**
     * @param {string} translationKey translation key of a human-readable text for the link
     * @param {string} state ui-sref target
     */
    forState(translationKey, state) {
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
