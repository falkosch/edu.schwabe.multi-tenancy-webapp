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

    /**
     * @param {string} text human-readable text for the link
     * @param {Function} handler handler click callback
     */
    forHandler(text, handler) {
        this.entries.push({
            text,
            handler,
        });

        return this;
    }
}
