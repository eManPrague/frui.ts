import LifecycleScreenNavigatorBase from "../../src/navigation/lifecycleScreenNavigatorBase";
import { testLifecycle } from "./navigator.testHelpers";

describe("LifecycleScreenNavigatorBase", () => {
  testLifecycle((screen, eventHub) => new LifecycleScreenNavigatorBase(screen, eventHub));
});
