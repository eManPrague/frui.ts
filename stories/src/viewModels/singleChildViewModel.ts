import { ConductorSingleChild } from "@frui.ts/screens";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";
import "./helpers";

export default class SingleChildViewModel extends ConductorSingleChild<ChildViewModel> {
  private child1: ChildViewModel;
  private child2: ChildViewModel;

  constructor() {
    super();

    this.child1 = new ChildViewModel();
    this.child1.navigationName = "One";
    this.child1.name = "Child One";
    this.child1.text = "View Model One";

    this.child2 = new ChildViewModel();
    this.child2.navigationName = "Two";
    this.child2.name = "Child Two";
    this.child2.text = "View Model Two";
  }

  @action.bound
  selectChild1() {
    this.tryActivateChild(this.child1);
  }

  @action.bound
  selectChild2() {
    this.tryActivateChild(this.child2);
  }

  protected findNavigationChild(navigationName: string) {
    if (this.child1.navigationName === navigationName) {
      return this.child1;
    } else if (this.child2.navigationName === navigationName) {
      return this.child2;
    } else {
      return undefined;
    }
  }
}
