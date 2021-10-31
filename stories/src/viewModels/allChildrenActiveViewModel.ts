import { AllChildrenActiveConductor, ScreenBase } from "@frui.ts/screens";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";
import type { IChildScreen } from "./types";

export default class AllChildrenActiveViewModel
  extends ScreenBase<AllChildrenActiveConductor<ChildViewModel>>
  implements IChildScreen
{
  name = "All Active";

  private childCounter = 1;

  constructor() {
    super();
    this.navigator = new AllChildrenActiveConductor<ChildViewModel>(this);
    this.navigator.navigationName = "all";
  }

  @action.bound
  addChild() {
    const newChild = new ChildViewModel(this.childCounter.toString(), `Child #${this.childCounter}`);
    this.navigator.children.push(newChild);
    this.childCounter++;
  }

  @action
  removeChild(child: ChildViewModel) {
    const index = this.navigator.children.indexOf(child);
    if (index >= 0) {
      this.navigator.children.splice(index, 1);
    }
  }
}
