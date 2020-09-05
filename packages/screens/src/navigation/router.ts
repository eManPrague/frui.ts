import Route from "route-parser";
import { IScreen } from "../structure/types";
import NavigationConfiguration from "./navigationConfiguration";
import { appendQueryString, combinePath, combinePathString } from "./navigationPath";
import { Class, ICanNavigate, INavigationParent, RouteDefinition, RouteName, SelfLink } from "./types";

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

type NavigationRoot = Pick<ICanNavigate, "navigate">;

export default class Router {
  static Self: typeof SelfLink = SelfLink;

  private routes: Map<RouteName, Route>;

  private navigationRoot: NavigationRoot;

  /**
   * Initializes the Router and builds defined routes
   */
  start(rootViewModel: ICanNavigate, navigationAdapter?: NavigationRoot) {
    this.routes = new Map<RouteName, Route>();
    this.navigationRoot = navigationAdapter ?? rootViewModel;

    const rootKey = this.findRouteKeyForInstance(rootViewModel);
    if (rootKey) {
      this.buildRoutes(rootKey);
    }
  }

  getPath(routeName: RouteName, params?: any) {
    const route = this.routes.get(routeName);
    if (route) {
      return route.reverse(params);
    } else {
      return undefined;
    }
  }

  getUrl(routeName: RouteName, routeParams?: any, queryParams?: any) {
    const path = this.getPath(routeName, routeParams);
    return appendQueryString(NavigationConfiguration.hashPrefix + path, queryParams);
  }

  navigate(routeName: RouteName, routeParams?: any, queryParams?: any) {
    const path = this.getPath(routeName, routeParams);
    if (path) {
      return this.navigationRoot.navigate(path, queryParams);
    } else {
      console.warn("Router could not find route", { routeName, routeParams, queryParams });
    }
  }

  private findRouteKeyForInstance(instance: any) {
    for (const key of routeDefinitions.keys()) {
      if (instance instanceof key) {
        return key;
      }
    }

    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/tslint/config
  private buildRoutes(key: Class, parentRoute?: string) {
    const definitions = routeDefinitions.get(key);
    if (definitions) {
      for (const routeDefinition of definitions) {
        const path = combinePathString(parentRoute, routeDefinition.route);

        if (routeDefinition.name) {
          const route = new Route(path);
          const name = routeDefinition.name === SelfLink ? key : routeDefinition.name;
          this.routes.set(name, route);
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
