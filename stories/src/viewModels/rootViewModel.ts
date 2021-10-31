import { OneOfListActiveConductor, ScreenBase } from "@frui.ts/screens";
import AllChildrenActiveViewModel from "./allChildrenActiveViewModel";
import OneChildActiveViewModel from "./oneChildActiveViewModel";
import SingleChildViewModel from "./singleChildViewModel";
import type { IChildScreen } from "./types";

export default class RootViewModel extends ScreenBase<OneOfListActiveConductor<IChildScreen>> {
  name = "My Root View Model";

  constructor() {
    super();

    this.navigator = new OneOfListActiveConductor<IChildScreen>(this);
    this.navigator.navigationName = "root";
    this.navigator.children.push(new AllChildrenActiveViewModel(), new OneChildActiveViewModel(), new SingleChildViewModel());
  }
}
