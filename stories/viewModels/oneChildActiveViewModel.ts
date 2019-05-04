import ConductorOneChildActive from "@src/lifecycle/conductorOneChildActive";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";

export default class OneChildActiveViewModel extends ConductorOneChildActive<ChildViewModel> {
  private childCounter = 1;

  @action.bound addChild() {
    const newChild = new ChildViewModel();
    newChild.navigationName = this.childCounter.toString();
    newChild.name = `Child ${this.childCounter}`;
    newChild.text = `This is content of child #${this.childCounter}`;
    this.items.push(newChild);

    this.childCounter++;
  }

  protected onActivate() {
    if (!this.activeItem) {
      const navigationPath = this.parent.getNavigationPath(this);
      // tslint:disable-next-line: no-console
      console.log("navigation", navigationPath.path, navigationPath.isClosed);
    }
    return super.onActivate();
  }
}
