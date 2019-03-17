import _ from 'lodash';

import { EventEmitterServiceName } from '../event-emitter/event-emitter.service';

export const ViewModelEventChanged = 'view-model-changed';

export const ViewModelEventSaved = 'view-model-saved';

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

        this.onChanged = this.eventEmitterService.of(ViewModelEventChanged);
        this.onSaved = this.eventEmitterService.of(ViewModelEventSaved);

        this.originalModel = originalModel;

        this.reset();
    }

    mapProperties(mappings) {
        const modelViewModelMappings = _.mapValues(mappings, (modelProperty) => {

            const getModelValue = () => _.get(this.transientModel, modelProperty);

            return {
                enumerable: true,
                get() {
                    return getModelValue();
                },
                set(newValue) {
                    const oldValue = getModelValue();
                    _.set(this.transientModel, modelProperty, newValue);
                    return this.notifyModelChanged(modelProperty, oldValue, newValue);
                },
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
        return this.onSaved.emit({
            viewModel: this,
        });
    }

    reset() {
        this.$dirty = false;
        this.transientModel = _.cloneDeep(this.originalModel);
    }
}
