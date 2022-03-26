import type { SimpleScreenNavigator } from "..";
import TypedEventHub from "../events/typedEventHub";
import type ScreenLifecycleEventHub from "../navigation/screenLifecycleEventHub";
import type { ScreenNavigator } from "../navigation/types";
import type { RequiredLifecycleEvents } from "./hasLifecycleHandlers";

export default abstract class ScreenBase<TNavigator extends ScreenNavigator = SimpleScreenNavigator> {
  navigator: TNavigator;
  events: ScreenLifecycleEventHub<this>;

  constructor() {
    this.events = new TypedEventHub<RequiredLifecycleEvents<this>>();
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
