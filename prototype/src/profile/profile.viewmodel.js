import _ from 'lodash';

import { ViewModel } from '../core/view-models/view-model.viewmodel';

export class ProfileViewModel extends ViewModel {

    constructor(injectionService, profileModel) {
        super(injectionService, profileModel);

        this.mapProperties({
            username: 'authentication.ident.name',
        });
    }
}
