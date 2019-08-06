import { View } from './view.model';

export class ViewSavedEventData<ModelType, ViewModelType> {

    public constructor(
        public readonly view: View<ModelType, ViewModelType>,
    ) { }

}
