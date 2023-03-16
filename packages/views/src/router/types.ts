import type { IViewModel } from "../types";

export type NoParams = Record<never, string>;

export interface NavigationContext<TParams extends Record<string, string> = NoParams, TSearch = unknown> {
  isPreload?: boolean;
  params: TParams;
  search: TSearch;
}

export type IRouteViewModel<TParams extends Record<string, string> = NoParams, TSearch = unknown> = IViewModel<
  NavigationContext<TParams, TSearch>
>;
