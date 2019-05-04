import { NavigationPath } from "@src/navigation/types";

export interface IActivate {
  isActive: boolean;
  activate(): Promise<any>;
}

export interface IDeactivate {
  deactivate(close: boolean): Promise<any>;
}

export interface IScreen extends IActivate, IDeactivate {
  readonly navigationName: string;
  readonly name: string;
}

export interface IConductor<TChild> {
  activateItem(item: TChild): Promise<any>;
  deactivateItem(item: TChild, close: boolean): Promise<any>;
  getNavigationPath(item: TChild): NavigationPath;
}

export interface IChild<TParent> {
  parent: TParent;
  canClose(): Promise<boolean>;
  requestClose(): Promise<any>;
}

export interface IHasActiveItem<TChild> {
  activeItem: TChild;
}
