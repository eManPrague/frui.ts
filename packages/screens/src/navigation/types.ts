import type { Awaitable } from "@frui.ts/helpers";
import type { PathElement } from "../models/pathElements";

export interface ScreenNavigator<TScreen = unknown, TLocation = unknown> {
  readonly isActive: boolean;
  readonly screen?: TScreen;

  canNavigate(path: PathElement[]): Awaitable<boolean>;
  navigate(path: PathElement[], location?: TLocation): Promise<void>;

  navigationName: string;
  getNavigationState(): PathElement[];

  parent: ScreenNavigator | undefined;
  getPrimaryChild(): ScreenNavigator | undefined;
}

export interface LifecycleScreenNavigator<TScreen = unknown, TLocation = unknown> extends ScreenNavigator<TScreen, TLocation> {
  canDeactivate(isClosing: boolean): Awaitable<boolean>;
  deactivate(isClosing: boolean): Promise<void>;
}
