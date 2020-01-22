import { NavigationPath } from "./navigationPath";

export interface IHasNavigationName {
  readonly navigationName: string;
}

export interface IHasNavigationParams {
  navigationParams: any;
  applyNavigationParams?: (params: any) => Promise<any> | void;
}

export interface ICanNavigate {
  navigate(path: string | undefined, params: any): Promise<any> | void;
  getChildNavigationPath(item: IHasNavigationName, params: any): NavigationPath;
}
