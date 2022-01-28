import type { HasLifecycleEvents } from "../screens/hasLifecycleHandlers";
import type ScreenBase from "../screens/screenBase";
import LifecycleScreenNavigatorBase from "./lifecycleScreenNavigatorBase";
import type ScreenLifecycleEventHub from "./screenLifecycleEventHub";

export default class SimpleScreenNavigator<
  TScreen extends Partial<HasLifecycleEvents> & Partial<ScreenBase> = any,
  TNavigationParams extends Record<string, string | undefined> = Record<string, string | undefined>
> extends LifecycleScreenNavigatorBase<TScreen, TNavigationParams> {
  constructor(screen?: TScreen, navigationPrefix?: string, eventHub?: ScreenLifecycleEventHub<TScreen>) {
    super(screen, navigationPrefix, eventHub);
  }
}
