export interface IActivate {
  isActive: boolean;
  activate(): Promise<any>;
}

export interface IDeactivate {
  deactivate(close: boolean): Promise<any>;
}

export interface IScreen extends IActivate, IDeactivate {
}
