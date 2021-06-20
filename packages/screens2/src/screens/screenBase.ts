import TypedEventHub from "../events/typedEventHub";
import ScreenLifecycleEventHub from "../navigation/screenLifecycleEventHub";
import ScreenNavigator from "../navigation/screenNavigator";
import { HasLifecycleEvents } from "./hasLifecycleHandlers";

export default abstract class ScreenBase<TNavigator extends ScreenNavigator = ScreenNavigator> {
  navigator?: TNavigator;
  events: ScreenLifecycleEventHub<this>;

  constructor() {
    this.events = new TypedEventHub<HasLifecycleEvents<this>>();
  }
}
