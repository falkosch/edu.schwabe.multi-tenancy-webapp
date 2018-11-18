export const NavServiceName = 'navService';

export class NavService {

    entries = [];

    /**
     * @param {string} text human-readable text for the link
     * @param {string} state ui-sref target
     */
    forState(text, state) {
        this.entries.push({
            text,
            state,
        });

        return this;
    }
}
