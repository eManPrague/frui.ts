import { HasLifecycleEvents } from "../screens/hasLifecycleHandlers";
import ScreenBase from "../screens/screenBase";
import ScreenLifecycleNavigator from "./screenLifecycleNavigator";

export default class SimpleScreenNavigator<
  TScreen extends Partial<HasLifecycleEvents> & Partial<ScreenBase> = any,
  TNavigationParams = unknown
> extends ScreenLifecycleNavigator<TScreen, TNavigationParams> {}
