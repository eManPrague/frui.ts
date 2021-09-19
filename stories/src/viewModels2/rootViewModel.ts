import { ScreenBase } from "@frui.ts/screens2/src";
import OneOfListActiveConductor from "@frui.ts/screens2/src/navigation/conductors/oneOfListActiveConductor";
import AllChildrenActiveViewModel from "./allChildrenActiveViewModel";
import OneChildActiveViewModel from "./oneChildActiveViewModel";
import SingleChildViewModel from "./singleChildViewModel";
import { IChildScreen } from "./types";

export default class RootViewModel extends ScreenBase<OneOfListActiveConductor<RootViewModel, IChildScreen>> {
  name = "My Root View Model";

  constructor() {
    super();

    this.navigator = new OneOfListActiveConductor<RootViewModel, IChildScreen>(this);
    this.navigator.navigationName = "root";
    this.navigator.children.push(new AllChildrenActiveViewModel(), new OneChildActiveViewModel(), new SingleChildViewModel());
  }
}
