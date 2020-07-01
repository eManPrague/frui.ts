import { NavigationPath } from "./navigationPath";

export interface ICanNavigate {
  navigate(subPath: string | undefined, params: any): Promise<any> | void;

  getNavigationPath(): NavigationPath;
}

export interface INavigationParent<TChild> {
  getChildNavigationPath(child: TChild, childParams?: any): NavigationPath;
}
export type Class = { new (...args: any[]): any };

const SelfLink = Symbol("Router.Self");
export { SelfLink };

export type RouteName = string | symbol | Class;

export interface RouteDefinition {
  name?: RouteName | typeof SelfLink;
  route: string;
  children?: Class[];
}
