import ConductorOneChildActive from "@src/lifecycle/conductorOneChildActive";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";
import { notifyRoutePathChanged } from "./helpers";

export default class OneChildActiveViewModel extends ConductorOneChildActive<ChildViewModel> {
  private childCounter = 1;

  @action.bound addChild() {
    const newChild = new ChildViewModel();
    newChild.navigationName = this.childCounter.toString();
    newChild.name = `Child ${this.childCounter}`;
    newChild.text = `This is content of child #${this.childCounter}`;
    this.items.push(newChild);

    this.childCounter++;
    return newChild;
  }

  protected onActivate() {
    if (!this.activeItem) {
      notifyRoutePathChanged(this);
    }
    return super.onActivate();
  }

  protected getChild(name: string) {
    const child = this.items.find(x => x.navigationName === name);
    if (child) {
      return Promise.resolve(child);
    }
    else {
      this.childCounter = parseInt(name, 0);
      const newChild = this.addChild();
      return Promise.resolve(newChild);
    }
  }
}
