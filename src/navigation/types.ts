export interface NavigationPath {
  readonly path: string;
  readonly isClosed: boolean;
}

export interface IHasNavigationName {
  navigationName: string;
}
