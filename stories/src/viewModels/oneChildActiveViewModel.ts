import { OneOfListActiveConductor, ScreenBase } from "@frui.ts/screens";
import { action, makeObservable } from "mobx";
import ChildViewModel from "./childViewModel";
import type { IChildScreen } from "./types";

export default class OneChildActiveViewModel
  extends ScreenBase<OneOfListActiveConductor<ChildViewModel>>
  implements IChildScreen
{
  name = "One Active";

  private childCounter = 1;

  constructor() {
    super();
    makeObservable(this);
    this.navigator = new OneOfListActiveConductor<ChildViewModel>(this);
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
