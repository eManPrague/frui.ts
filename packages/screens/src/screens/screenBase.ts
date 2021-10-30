import TypedEventHub from "../events/typedEventHub";
import type ScreenLifecycleEventHub from "../navigation/screenLifecycleEventHub";
import type { ScreenNavigator } from "../navigation/types";
import type { HasLifecycleEvents } from "./hasLifecycleHandlers";

export default abstract class ScreenBase<TNavigator extends ScreenNavigator = ScreenNavigator> {
  navigator: TNavigator;
  events: ScreenLifecycleEventHub<this>;

  constructor() {
    this.events = new TypedEventHub<HasLifecycleEvents<this>>();
  }
}

export function getNavigator<TNavigator extends ScreenNavigator = ScreenNavigator>(
  target: unknown
): (Partial<TNavigator> & ScreenNavigator) | undefined {
  if (!target) {
    return undefined;
  }

  return (target as ScreenBase<TNavigator>).navigator as Partial<TNavigator> & ScreenNavigator;
}
