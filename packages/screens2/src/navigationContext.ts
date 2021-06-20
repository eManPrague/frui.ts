import ScreenNavigator from "./navigation/screenNavigator";

export interface NavigationContext<TScreen = unknown, TNavigationParams = unknown> {
  screen: TScreen;
  navigator: ScreenNavigator;
  navigationParams: TNavigationParams;
}

export interface ClosingNavigationContext<TScreen = unknown> {
  screen: TScreen;
  navigator: ScreenNavigator;
  isClosing: boolean;
}
