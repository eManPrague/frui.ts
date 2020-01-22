export interface IActivatable {
  isActive: boolean;
  activate(): Promise<any> | void;
  deactivate(close: boolean): Promise<any> | void;
}

export interface IScreen extends IActivatable {
  readonly name: string;
}

export interface IConductor<TChild> {
  activateChild(child: TChild): Promise<any> | void;
  closeChild(child: TChild): Promise<any> | void;
}

export interface IHasActiveChild<TChild> {
  activeChild?: TChild;
}

export interface IChild<TParent> {
  parent: TParent;
  canClose(): Promise<boolean> | boolean;
  requestClose(): Promise<any> | void;
}

export interface IBusyWatcher {
  readonly isBusy: boolean;
}
