import LifecycleScreenNavigatorBase from "../../src/navigation/lifecycleScreenNavigatorBase";
import { testLifecycle } from "./navigator.testHelpers";

class TestNavigator extends LifecycleScreenNavigatorBase<any, any> {}

describe("LifecycleScreenNavigatorBase", () => {
  testLifecycle((screen, eventHub) => new TestNavigator(screen, eventHub));
});
