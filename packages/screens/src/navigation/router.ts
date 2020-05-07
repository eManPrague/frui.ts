import Route from "route-parser";
import { IScreen } from "../structure/types";
import NavigationConfiguration from "./navigationConfiguration";
import { appendQueryString, combinePath, combinePathString } from "./navigationPath";
import { Class, ICanNavigate, INavigationParent, RouteDefinition } from "./types";

/** Shared route definitions created by the Router.registerRoute decorator */
const routeDefinitions = new Map<Class, RouteDefinition[]>();

function addRouteDefinition(viewModel: Class, route: RouteDefinition) {
  const existingRoutes = routeDefinitions.get(viewModel);
  if (existingRoutes) {
    existingRoutes.push(route);
  } else {
    routeDefinitions.set(viewModel, [route]);
  }
}

export default class Router {
  private routes = new Map<string, Route>();

  constructor(private rootViewModel: ICanNavigate) {}

  /**
   * Initializes the Router and builds defined routes
   */
  start() {
    const rootKey = this.findRootRouteKey();
    if (rootKey) {
      this.buildRoutes(rootKey);
    }
  }

  getPath(routeName: string, params?: any) {
    const route = this.routes.get(routeName);
    if (route) {
      return route.reverse(params);
    } else {
      return undefined;
    }
  }

  getUrl(routeName: string, routeParams?: any, queryParams?: any) {
    const path = this.getPath(routeName, routeParams);
    return appendQueryString(NavigationConfiguration.hashPrefix + path, queryParams);
  }

  navigate(routeName: string, routeParams?: any, queryParams?: any) {
    const path = this.getPath(routeName, routeParams);
    if (path) {
      return this.rootViewModel.navigate(path, queryParams);
    }
  }

  private findRootRouteKey() {
    for (const key of routeDefinitions.keys()) {
      if (this.rootViewModel instanceof key) {
        return key;
      }
    }

    return undefined;
  }

  private buildRoutes(key: Class, parentRoute?: string) {
    const definitions = routeDefinitions.get(key);
    if (definitions) {
      for (const routeDefinition of definitions) {
        const path = combinePathString(parentRoute, routeDefinition.route);

        if (routeDefinition.name) {
          const route = new Route(path);
          this.routes.set(routeDefinition.name, route);
        }

        if (routeDefinition.children) {
          for (const child of routeDefinition.children) {
            this.buildRoutes(child, path);
          }
        }
      }
    }
  }

  /**
   * Class decorator that registers marked view model to the route hierarchy
   * @param route Route definition
   */
  static registerRoute(route: RouteDefinition) {
    return function (target: Class) {
      addRouteDefinition(target, route);
    };
  }

  static getChildUrlFactory<TChild extends IScreen = IScreen>(
    parent: ICanNavigate & INavigationParent<TChild>,
    defaultParams?: any
  ) {
    const currentPath = parent.getNavigationPath();

    return (child: TChild | string | number, childParams?: any) => {
      const navigationName = (child as TChild).navigationName || (child as string);
      const path = combinePath(currentPath, navigationName, childParams);
      const url = path.path ? appendQueryString(path.path, childParams ? path.params : defaultParams || path.params) : undefined;
      return NavigationConfiguration.hashPrefix + url;
    };
  }
}
