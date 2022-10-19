import type { PartialGenerics, Route as RawRoute } from "@tanstack/react-location";
import type { IViewModel, LocationGenerics } from "./types";

export type Route<T extends PartialGenerics = LocationGenerics> = RawRoute<T>;

export type ViewModelRoute = Omit<Route, "children"> & {
  vmFactory: () => IViewModel;
  children?: (ViewModelRoute | Route)[];
};

export function buildRoutes(routes: (ViewModelRoute | Route)[]): Route[] {
  return routes.map(x => buildRoute(x));
}

export function buildRoute(route: ViewModelRoute | Route): Route {
  if (!isViewModelRoute(route)) {
    return route;
  }

  return {
    ...route,
    children: route.children?.map(x => (isViewModelRoute(x) ? buildRoute(x) : x)),
    async loader(match, { parentMatch }) {
      const vm = route.vmFactory();
      await vm.onInitialize?.(match, parentMatch);
      return { vm };
    },
    onMatch(match) {
      void match.data.vm?.onActivate?.(match);
    },
    onTransition(match) {
      void match.data.vm?.onNavigate?.(match);
    },
    unloader: match => {
      void match.data.vm?.onDeactivate?.(match);
    },
  };
}

export function isViewModelRoute(route: ViewModelRoute | Route): route is ViewModelRoute {
  return !!(route as ViewModelRoute).vmFactory;
}
