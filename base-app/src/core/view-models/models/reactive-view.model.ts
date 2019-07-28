import { EventEmitter } from '../../event-emitter/event-emitter.model';
import { View } from './view.model';
import { ViewChangedEventData } from './view-changed-event.model';
import { ViewSavedEventData } from './view-saved-event.model';

export interface ReactiveView<ModelType, ViewModelType> extends View<ModelType, ViewModelType> {
    readonly onChanged: EventEmitter<ViewChangedEventData<ModelType, ViewModelType>>;
    readonly onSaved: EventEmitter<ViewSavedEventData<ModelType, ViewModelType>>;
}
