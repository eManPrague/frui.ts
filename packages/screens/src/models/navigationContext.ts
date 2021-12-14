import type { ScreenNavigator } from "../navigation/types";
import type { PathElement } from "./pathElements";

export interface NavigationContext<TScreen = unknown, TNavigationParams = unknown> {
  screen?: TScreen;
  navigator: ScreenNavigator;
  navigationParams: TNavigationParams;

  path: PathElement[];
}

export interface ClosingNavigationContext<TScreen = unknown> {
  screen?: TScreen;
  navigator: ScreenNavigator;
  isClosing: boolean;
}
