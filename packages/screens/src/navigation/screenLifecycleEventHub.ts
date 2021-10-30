import type TypedEventHub from "../events/typedEventHub";
import type { HasLifecycleEvents } from "../screens/hasLifecycleHandlers";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface ScreenLifecycleEventHub<TScreen> extends TypedEventHub<HasLifecycleEvents<TScreen>> {}
