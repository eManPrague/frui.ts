import type { Awaitable } from "@frui.ts/helpers";
import type { ClosingNavigationContext, NavigationContext } from "../models/navigationContext";

export interface HasLifecycleEvents<TScreen = unknown, TNavigationParams = unknown, TLocation = unknown> {
  /** Called only once, on the first call of navigate */
  onInitialize: (context: NavigationContext<TNavigationParams, TScreen, TLocation>) => Awaitable<unknown>;

  /** Checks if the new route could be activated. Used mainly on conductors to check if current child can be closed because of the new route. */
  canNavigate: (context: NavigationContext<TNavigationParams, TScreen, TLocation>) => Awaitable<boolean>;

  /** Called whenever navigate is called on a deactivated screen */
  onActivate: (context: NavigationContext<TNavigationParams, TScreen, TLocation>) => Awaitable<unknown>;

  /** Called on every navigattion path change */
  onNavigate: (context: NavigationContext<TNavigationParams, TScreen, TLocation>) => Awaitable<unknown>;

  /** Returns value whether the current screen could be closed */
  canDeactivate: (context: ClosingNavigationContext<TScreen>) => Awaitable<boolean>;

  /** Called on every screen deactivation */
  onDeactivate: (context: ClosingNavigationContext<TScreen>) => Awaitable<unknown>;

  /** Called when the screen is about to be closed */
  onDispose: (context: ClosingNavigationContext<TScreen>) => Awaitable<unknown>;
}
