import _ from 'lodash';

import { EventEmitterService, EventEmitterServiceName } from '../event-emitter/event-emitter.service';
import { EventEmitter } from '../event-emitter/event-emitter.model';
import { ViewChangedEventData } from './models/view-changed-event.model';
import { ViewSavedEventData } from './models/view-saved-event.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactiveView } from './models/reactive-view.model';

export enum ViewEvents {
    Changed = 'view-changed',
    Saved = 'view-saved',
}

export const OriginalModelInjectName = 'originalModel';

export const MappingsInjectName = 'mappings';

export type PropertyPathMapping<T> = Record<keyof T, string>;

export class ReactiveViewWithMappings<ModelType extends Record<string, any>,
    ViewModelType> implements ReactiveView<ModelType, ViewModelType> {

    public static $inject = [
        EventEmitterServiceName,
        OriginalModelInjectName,
        MappingsInjectName,
    ];

    public onChanged: EventEmitter<ViewChangedEventData<ModelType, ViewModelType>>;

    public onSaved: EventEmitter<ViewSavedEventData<ModelType, ViewModelType>>;

    public $dirty = false;

    private _viewModel?: ViewModelType;

    private _transientModel: ModelType;

    public constructor(
        eventEmitterService: EventEmitterService,
        private _originalModel: ModelType,
    ) {
        this.onChanged = eventEmitterService.of(ViewEvents.Changed);
        this.onSaved = eventEmitterService.of(ViewEvents.Saved);

        this._transientModel = _.cloneDeep(this._originalModel);
    }

    public get viewModel(): ViewModelType | undefined {
        return this._viewModel;
    }

    public get originalModel(): ModelType {
        return this._originalModel;
    }

    public get transientModel(): ModelType {
        return this._transientModel;
    }

    /**
     * @param mappings maps a name of a property on the view model to a name of a property in the
     * transient clone of the original model
     */
    protected mapProperties(mappings: PropertyPathMapping<ViewModelType>): void {
        const getModelValue = (propertyPath: string): any => this.getModelValue(propertyPath);
        const setModelValue = (
            newValue: any,
            viewModelProperty: keyof ViewModelType,
            modelPropertyPath: string,
        ): angular.IAngularEvent => this.setModelValue(
            newValue,
            viewModelProperty,
            modelPropertyPath,
        );

        this._viewModel = Object.defineProperties(
            {},
            _.mapValues(
                mappings,
                (modelProperty: string, viewModelProperty: any) => ({
                    enumerable: true,
                    get() {
                        return getModelValue(modelProperty);
                    },
                    set(newValue: any) {
                        setModelValue(newValue, viewModelProperty, modelProperty);
                    },
                }),
            ),
        );
    }

    public getModelValue(propertyPath: string): any {
        return _.get(this._transientModel, propertyPath);
    }

    public setModelValue(
        newValue: any,
        viewModelProperty: keyof ViewModelType,
        modelPropertyPath: string,
    ): angular.IAngularEvent {
        const oldValue = this.getModelValue(modelPropertyPath);
        _.set<ModelType>(this._transientModel, modelPropertyPath, newValue);
        this.$dirty = true;
        return this.notifyModelChanged(viewModelProperty, modelPropertyPath, oldValue, newValue);
    }

    private notifyModelChanged(
        viewModelProperty: keyof ViewModelType,
        modelPropertyPath: string,
        oldValue: any,
        newValue: any,
    ): angular.IAngularEvent {
        return this.onChanged.emit(
            new ViewChangedEventData<ModelType, ViewModelType>(
                this,
                viewModelProperty,
                modelPropertyPath,
                oldValue,
                newValue,
            ),
        );
    }

    public save(): angular.IAngularEvent {
        this._originalModel = this._transientModel;
        this.reset();
        return this.onSaved.emit(new ViewSavedEventData<ModelType, ViewModelType>(this));
    }

    public reset(): void {
        this.$dirty = false;
        this._transientModel = _.cloneDeep(this._originalModel);
    }
}
