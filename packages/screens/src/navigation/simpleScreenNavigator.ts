import type { HasLifecycleEvents } from "../screens/hasLifecycleHandlers";
import type ScreenBase from "../screens/screenBase";
import LifecycleScreenNavigatorBase from "./lifecycleScreenNavigatorBase";

export default class SimpleScreenNavigator<
  TNavigationParams = any,
  TScreen extends HasLifecycleEvents & Partial<ScreenBase> = any,
  TLocation = undefined
> extends LifecycleScreenNavigatorBase<TNavigationParams, TScreen, TLocation> {}
