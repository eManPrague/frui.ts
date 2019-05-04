export interface IActivate {
  isActive: boolean;
  activate(): Promise<any>;
}

export interface IDeactivate {
  deactivate(close: boolean): Promise<any>;
}

export interface IScreen extends IActivate, IDeactivate {
}

export interface IConductor<TChild> {
  activateItem(item: TChild): Promise<any>;
  deactivateItem(item: TChild, close: boolean): Promise<any>;
}

export interface IChild<TParent> {
  parent: TParent;
  canClose(): Promise<boolean>;
  requestClose(): Promise<any>;
}

export interface IHasActiveItem<TChild> {
  activeItem: TChild;
}
