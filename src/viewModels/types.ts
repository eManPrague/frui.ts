export interface IDetailViewModel {
  isCreating: boolean;
  isEditing: boolean;
}

export interface IChild<T> {
  parent: T;
}

// tslint:disable-next-line: interface-over-type-literal
type ViewModel = {};

export interface IConductor {
  activateItem(item: ViewModel): void;
  deactivateItem(item: ViewModel, close: boolean): void;
}

export interface IHasActiveItem {
  activeItem: ViewModel;
}
