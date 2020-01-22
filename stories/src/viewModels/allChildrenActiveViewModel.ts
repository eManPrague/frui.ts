import { ConductorAllChildrenActive } from "@frui.ts/screens";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";
import { notifyRoutePathChanged } from "./helpers";

export default class AllChildrenActiveViewModel extends ConductorAllChildrenActive<ChildViewModel> {
  private childCounter = 1;

  @action.bound addChild() {
    const newChild = new ChildViewModel();
    newChild.navigationName = this.childCounter.toString();
    newChild.name = `Child ${this.childCounter}`;
    newChild.text = `This is content of child #${this.childCounter}`;
    this.children.push(newChild);

    this.childCounter++;
    return newChild;
  }

  protected onActivate() {
    if (!this.children.length) {
      notifyRoutePathChanged(this);
    }
    return super.onActivate();
  }

  protected findNavigationChild(name: string) {
    const child = this.children.find(x => x.navigationName === name);
    if (child) {
      return child;
    } else {
      this.childCounter = parseInt(name, 0);
      const newChild = this.addChild();
      return newChild;
    }
  }
}
