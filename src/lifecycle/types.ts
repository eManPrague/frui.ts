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
  activateItem(item: TChild): void;
  deactivateItem(item: TChild, close: boolean): void;
}

export interface IChild<TParent> {
  parent: TParent;
  canClose(): Promise<boolean>;
}

export interface IHasActiveItem<TChild> {
  activeItem: TChild;
}
