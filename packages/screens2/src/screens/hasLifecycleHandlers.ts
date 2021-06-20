import { ClosingNavigationContext, NavigationContext } from "../navigationContext";

export interface HasLifecycleEvents<TScreen = unknown> {
  onInitialize: (context: NavigationContext<TScreen>) => Promise<unknown> | void;

  canNavigate: (context: NavigationContext<TScreen>) => Promise<boolean> | boolean;

  onActivate: (context: NavigationContext<TScreen>) => Promise<unknown> | void;

  onNavigate: (context: NavigationContext<TScreen>) => Promise<unknown> | void;

  canDeactivate: (context: ClosingNavigationContext<TScreen>) => Promise<boolean> | boolean;

  onDeactivate: (context: ClosingNavigationContext<TScreen>) => Promise<unknown> | void;

  onDispose: (context: ClosingNavigationContext<TScreen>) => Promise<unknown> | void;
}
