import type { MakeGenerics, PartialGenerics, RouteMatch as RawRouteMatch, UseSearchType } from "@tanstack/react-location";

export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    vm?: IViewModel;
  };
}>;

export type RouteMatch<T extends PartialGenerics = LocationGenerics> = RawRouteMatch<T>;
export type SearchType<T extends PartialGenerics = LocationGenerics> = ReturnType<UseSearchType<T>>;

export interface IViewModel<T extends PartialGenerics = LocationGenerics> {
  onInitialize?(routeMatch: RouteMatch<T>, parentMatch?: RouteMatch<T>): Promise<unknown> | unknown;
  onActivate?(routeMatch: RouteMatch<T>): Promise<unknown> | unknown;
  onNavigate?(routeMatch: RouteMatch<T>): Promise<unknown> | unknown;
  onSearchChanged?(search: SearchType<T>, routeMatch: RouteMatch<T>): Promise<unknown> | unknown;
  onDeactivate?(routeMatch: RouteMatch<T>): Promise<unknown> | unknown;
}
