import type PathElement from "../models/pathElements";
import type ScreenBase from "../screens/screenBase";
import type { RouteDefinition, RouteName } from "./route";
import { Route } from "./route";
import type Router from "./router";
import RouterBase from "./routerBase";

const URL_SEPARATOR = "/";
const SEGMENT_REGEX = /^(?<name>[\w-]+)(\[(?<params>\S+)\])?$/;

export default abstract class UrlRouterBase extends RouterBase implements Router {
  protected routes = new Map<RouteName, Route<any>>();

  async initialize() {
    const path = this.getCurrentPath();
    if (path.length) {
      const url = this.serializePath(path);
      await this.persistUrl(url);
    }
  }

  protected abstract persistUrl(url: string): Promise<void>;

  registerRoute(definition: RouteDefinition) {
    const names = Array.isArray(definition.name) ? definition.name : [definition.name];
    for (const name of names) {
      this.routes.set(name, new Route<any>(name, definition.path, definition.aliasPaths));
    }
  }

  // navigate

  async navigate(path: string | PathElement[]) {
    // TODO unwrap path if alias for a route

    const elements: PathElement[] =
      typeof path === "string" ? path.split(URL_SEPARATOR).map(x => this.deserializePath(x) ?? { name: "parse-error" }) : path;
    await this.rootNavigator?.navigate(elements);

    const currentPath = this.getCurrentPath();
    const currentUrl = this.serializePath(currentPath);
    // or should we just use the 'path'?
    await this.persistUrl(currentUrl);
  }

  navigateToScreen(screen: ScreenBase) {
    const path = this.getPathForChild(screen.navigator, undefined);
    return this.navigate(path);
  }

  async navigateToParent(child: ScreenBase) {
    const parentNavigator = child.navigator.parent;
    if (parentNavigator) {
      const path = this.getPathForChild(parentNavigator, undefined);
      await this.navigate(path);
    }
  }

  navigateToChild(parent: ScreenBase, child: ScreenBase) {
    const path = this.getPathForChild(parent.navigator, child.navigator);
    return this.navigate(path);
  }

  navigateToRoute(routeName: string, params: any) {
    const path = this.routes.get(routeName)?.getUrl(params);
    if (path) {
      return this.navigate(path);
    }
    console.warn("Could not find route", routeName);
    return Promise.resolve();
  }

  // get path

  getUrlForScreen(screen: ScreenBase) {
    const path = this.getPathForChild(screen.navigator, undefined);
    return this.serializePath(path);
  }

  getUrlForParent(child: ScreenBase) {
    const parentNavigator = child.navigator.parent;
    if (parentNavigator) {
      const path = this.getPathForChild(parentNavigator, undefined);
      return this.serializePath(path);
    } else {
      return "missing-navigator";
    }
  }

  getUrlForChild(parent: ScreenBase, child: ScreenBase) {
    const path = this.getPathForChild(parent.navigator, child.navigator);
    return this.serializePath(path);
  }

  getUrlForRoute(routeName: RouteName, params?: any) {
    const route = this.routes.get(routeName);
    if (route) {
      return route.getUrl(params);
    }
    return false;
  }

  protected serializePath(pathElements: PathElement[]): string {
    return pathElements.map(x => this.serializePathElement(x)).join(URL_SEPARATOR);
  }

  protected serializePathElement(element: PathElement): string {
    if (element.params) {
      const values = Object.entries(element.params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
      return `${element.name}[${values.join(",")}]`;
    } else {
      return element.name;
    }
  }

  protected deserializePath(text: string): PathElement | undefined {
    const match = SEGMENT_REGEX.exec(text)?.groups;

    if (!match) {
      return undefined;
    }

    let paramsObject: Record<string, any> | undefined = undefined;
    if (match.params) {
      const pairs = match.params.split(",").map(x => decodeURIComponent(x).split("=", 2) as [string, string]);
      paramsObject = Object.fromEntries(pairs);
    }

    return {
      name: match.name,
      params: paramsObject,
    };
  }
}
