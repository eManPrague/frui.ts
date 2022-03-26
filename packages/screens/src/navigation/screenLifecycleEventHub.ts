import type TypedEventHub from "../events/typedEventHub";
import type { RequiredLifecycleEvents } from "../screens/hasLifecycleHandlers";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface ScreenLifecycleEventHub<TScreen> extends TypedEventHub<RequiredLifecycleEvents<TScreen>> {}
