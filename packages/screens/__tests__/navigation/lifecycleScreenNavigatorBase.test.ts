import { describe } from "vitest";
import LifecycleScreenNavigatorBase from "../../src/navigation/lifecycleScreenNavigatorBase";
import { testLifecycle } from "./navigator.testHelpers";

class TestNavigator extends LifecycleScreenNavigatorBase<any, any, unknown> {}

describe("LifecycleScreenNavigatorBase", () => {
  testLifecycle((screen, eventHub) => new TestNavigator(screen, undefined, undefined, eventHub));
});
