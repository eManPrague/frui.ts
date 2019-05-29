export interface IActivatable {
  isActive: boolean;
  activate(): Promise<any>;
}

export interface IDeactivatable {
  deactivate(close: boolean): Promise<any>;
}

export interface IScreen extends IActivatable, IDeactivatable {
  readonly name: string;
}

export interface IConductor<TChild> {
  activateItem(item: TChild): Promise<any>;
  deactivateItem(item: TChild, close: boolean): Promise<any>;
}

export interface IHasActiveItem<TChild> {
  activeItem: TChild;
}

export interface IChild<TParent> {
  parent: TParent;
  canClose(): Promise<boolean>;
  requestClose(): Promise<any>;
}

export interface IBusyWatcher {
  readonly isBusy: boolean;
}
