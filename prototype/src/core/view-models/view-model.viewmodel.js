import _ from 'lodash';

import { EventEmitterServiceName } from '../event-emitter/event-emitter.service';

export const ViewModelsServiceName = 'userStateService';

export class ViewModelEvents {

    static Changed = 'view-model-changed';

    static Saved = 'view-model-saved';

}

export class ViewModel {

    static $inject = {
        eventEmitterService: EventEmitterServiceName,
    };

    originalModel;

    transientModel;

    $dirty = false;

    onChanged;

    onSaved;

    constructor(injectionService, originalModel) {
        injectionService.injectByStaticInjectionNames(this);

        this.onChanged = this.eventEmitterService.of(ViewModelEvents.Changed);
        this.onSaved = this.eventEmitterService.of(ViewModelEvents.Saved);

        this.originalModel = originalModel;

        this.reset();
    }

    mapProperties(mappings) {
        const modelViewModelMappings = _.mapValues(mappings, (modelProperty) => {

            const getModelValue = () => _.get(this.transientModel, modelProperty);

            const setModelValue = (newValue) => {
                const oldValue = getModelValue();
                _.set(this.transientModel, modelProperty, newValue);
                return this.notifyModelChanged(modelProperty, oldValue, newValue);
            };

            return {
                enumerable: true,
                get: getModelValue,
                set: setModelValue,
            };
        });

        Object.defineProperties(this, modelViewModelMappings);
    }

    notifyModelChanged(property, oldValue, newValue) {
        this.$dirty = true;
        return this.onChanged.emit({
            viewModel: this,
            property,
            oldValue,
            newValue,
        });
    }

    save() {
        this.originalModel = this.transientModel;
        this.reset();
        return this.onSaved.emit(this);
    }

    reset() {
        this.$dirty = false;
        this.transientModel = _.cloneDeep(this.originalModel);
    }
}
