import { ConductorSingleChild } from "@frui.ts/screens";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";
import { notifyRoutePathChanged } from "./helpers";

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
    this.activateChild(this.child1);
  }

  @action.bound
  selectChild2() {
    this.activateChild(this.child2);
  }

  protected onActivate() {
    if (!this.activeChild) {
      notifyRoutePathChanged(this);
    }
    return super.onActivate();
  }

  protected findNavigationChild(navigationName: string) {
    if (this.child1.navigationName === navigationName) {
      return Promise.resolve(this.child1);
    }
    else if (this.child2.navigationName === navigationName) {
      return Promise.resolve(this.child2);
    }
    else {
      return Promise.resolve(undefined);
    }
  }
}
