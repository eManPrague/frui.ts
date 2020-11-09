import { ConductorAllChildrenActive } from "@frui.ts/screens";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";
import "./helpers";

export default class AllChildrenActiveViewModel extends ConductorAllChildrenActive<ChildViewModel> {
  private childCounter = 1;

  @action.bound
  addChild() {
    const newChild = new ChildViewModel();
    newChild.navigationName = this.childCounter.toString();
    newChild.name = `Child ${this.childCounter}`;
    newChild.text = `This is content of child #${this.childCounter}`;
    this.children.push(newChild);

    this.childCounter++;
    return newChild;
  }

  protected findNavigationChild(name: string | undefined) {
    if (!name) {
      return undefined;
    }

    const child = this.children.find(x => x.navigationName === name);
    if (child) {
      return child;
    } else {
      this.childCounter = parseInt(name, 0);
      return this.addChild();
    }
  }
}
