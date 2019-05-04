import ConductorAllChildrenActive from "@src/lifecycle/conductorAllChildrenActive";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";

export default class AllChildrenActiveViewModel extends ConductorAllChildrenActive<ChildViewModel>
{
  private childCounter = 1;

  @action.bound addChild() {
    const newChild = new ChildViewModel();
    newChild.title = `Child ${this.childCounter}`;
    newChild.text = `This is content of child #${this.childCounter}`;
    this.items.push(newChild);

    this.childCounter++;
  }
}
