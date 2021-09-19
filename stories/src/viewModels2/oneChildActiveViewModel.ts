import { ScreenBase } from "@frui.ts/screens2/src";
import OneOfListActiveConductor from "@frui.ts/screens2/src/navigation/conductors/oneOfListActiveConductor";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";
import { IChildScreen } from "./types";

export default class OneChildActiveViewModel
  extends ScreenBase<OneOfListActiveConductor<OneChildActiveViewModel, ChildViewModel>>
  implements IChildScreen {
  name = "One Active";

  private childCounter = 1;

  constructor() {
    super();
    this.navigator = new OneOfListActiveConductor<OneChildActiveViewModel, ChildViewModel>(this);
    this.navigator.navigationName = "one";
    this.navigator.preserveActiveChild = true;
  }

  @action.bound
  addChild() {
    const newChild = new ChildViewModel(this.childCounter.toString(), `Child #${this.childCounter}`);
    this.navigator.children.push(newChild);
    this.childCounter++;
  }
}
