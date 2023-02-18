export type NoParams = Record<never, string>;

export interface NavigationContext<TParams extends Record<string, string> = NoParams, TSearch = unknown> {
  isPreload?: boolean;
  params: TParams;
  search: TSearch;
}

export interface IViewModel<TParams extends Record<string, string> = NoParams, TSearch = unknown> {
  onInitialize?(context: NavigationContext<TParams, TSearch>): Promise<unknown> | unknown;
  onActivate?(context: NavigationContext<TParams, TSearch>): Promise<unknown> | unknown;
  onNavigate?(context: NavigationContext<TParams, TSearch>): Promise<unknown> | unknown;
  onSearchChanged?(context: NavigationContext<TParams, TSearch>): Promise<unknown> | unknown;
  onDeactivate?(context: NavigationContext<TParams, TSearch>): Promise<unknown> | unknown;
}
