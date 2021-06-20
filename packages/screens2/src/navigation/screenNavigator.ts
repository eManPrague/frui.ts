export default interface ScreenNavigator<TNavigationParams = unknown> {
  canNavigate(navigationParams: TNavigationParams): Promise<boolean> | boolean;
  navigate(navigationParams: TNavigationParams): Promise<void>;
}
