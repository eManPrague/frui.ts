export interface IActivatable {
  isActive: boolean;
  activate(): Promise<any> | void;

  canDeactivate(isClosing: boolean): Promise<boolean> | boolean;

  deactivate(isClosing: boolean): Promise<any> | void;
}

export interface IScreen extends IActivatable {
  readonly name: string;
  readonly navigationName: string;
}

export interface IConductor<TChild> {
  tryActivateChild(child: TChild): Promise<boolean> | boolean;
  closeChild(child: TChild, forceClose?: boolean): Promise<boolean> | boolean;
}

export interface IHasActiveChild<TChild> {
  activeChild?: TChild;
}

export interface IChild<TParent = IConductor<IScreen>> {
  parent: TParent;
  requestClose(): Promise<boolean> | boolean;
}

export interface IBusyWatcher {
  readonly isBusy: boolean;
}
