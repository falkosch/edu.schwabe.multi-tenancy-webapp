import _ from 'lodash';

export class MenubarController {

    static $inject = [
        '$state',
    ];

    constructor($state) {
        this.$state = $state;
    }

    get currentStateTitle() {
        return _.get(this.$state.current, 'data.title', this.$state.current.name);
    }
}
