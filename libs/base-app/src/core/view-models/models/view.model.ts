export interface View<ModelType, ViewModelType> {
    $dirty: boolean;
    readonly originalModel: ModelType;
    readonly transientModel: ModelType;
    readonly viewModel?: ViewModelType;
    save(): angular.IAngularEvent;
    reset(): void;
}
