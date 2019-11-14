import { NavigationPath } from "./navigationPath";

export interface IHasNavigationName {
  readonly navigationName: string;
}

export interface IHasNavigationParams {
  navigationParams: any;
}

export interface ICanApplyNavigationParams {
  applyNavigationParams(params: any): Promise<any> | void;
}

export interface ICanNavigate {
  navigate(path: string, params: any): Promise<any>;
  getChildNavigationPath(item: IHasNavigationName, params: any): NavigationPath;
}
