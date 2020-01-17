export interface IActivatable {
  isActive: boolean;
  activate(): Promise<any>;
  deactivate(close: boolean): Promise<any>;
}

export interface IScreen extends IActivatable {
  readonly name: string;
}

export interface IConductor<TChild> {
  activateChild(child: TChild): Promise<any>;
  closeChild(child: TChild): Promise<any>;
}

export interface IHasActiveChild<TChild> {
  activeChild?: TChild;
}

export interface IChild<TParent> {
  parent: TParent;
  canClose(): Promise<boolean>;
  requestClose(): Promise<any>;
}

export interface IBusyWatcher {
  readonly isBusy: boolean;
}
