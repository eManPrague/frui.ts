import { HasLifecycleEvents } from "../screens/hasLifecycleHandlers";
import ScreenBase from "../screens/screenBase";
import ScreenLifecycleNavigator from "./lifecycleScreenNavigatorBase";

export default class SimpleScreenNavigator<
  TScreen extends Partial<HasLifecycleEvents> & Partial<ScreenBase> = any,
  TNavigationParams extends Record<string, string> = Record<string, string>
> extends ScreenLifecycleNavigator<TScreen, TNavigationParams> {}
