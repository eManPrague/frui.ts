import { ScreenBase } from "@frui.ts/screens2/src";
import SimpleScreenNavigator from "@frui.ts/screens2/src/navigation/simpleScreenNavigator";

export default class RootViewModel extends ScreenBase {
  name = "My Root View Model";

  constructor() {
    super();

    this.navigator = new SimpleScreenNavigator(this);
  }
}
