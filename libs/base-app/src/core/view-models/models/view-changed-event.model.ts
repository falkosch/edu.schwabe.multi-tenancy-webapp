import { View } from './view.model';

export class ViewChangedEventData<ModelType, ViewModelType> {

    public constructor(
        public readonly view: View<ModelType, ViewModelType>,
        public readonly viewModelProperty: keyof ViewModelType,
        public readonly modelPropertyPath: string,
        public readonly oldValue: any,
        public readonly newValue: any,
    ) { }

}
