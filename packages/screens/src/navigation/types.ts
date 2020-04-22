import { NavigationPath } from "./navigationPath";

export interface ICanNavigate {
  navigate(subPath: string | undefined, params: any): Promise<any> | void;

  getNavigationPath(): NavigationPath;
}

export interface INavigationParent<TChild> {
  getChildNavigationPath(child: TChild, childParams?: any): NavigationPath;
}
