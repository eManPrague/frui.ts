import ConductorSingleChild from "@src/lifecycle/conductorSingleChild";
import { action } from "mobx";
import ChildViewModel from "./childViewModel";

export default class SingleChildViewModel extends ConductorSingleChild<ChildViewModel> {
  private child1: ChildViewModel;
  private child2: ChildViewModel;

  constructor() {
    super();

    this.child1 = new ChildViewModel();
    this.child1.title = "One";
    this.child1.text = "View Model One";

    this.child2 = new ChildViewModel();
    this.child2.title = "Two";
    this.child2.text = "View Model Two";
  }

  @action.bound
  selectChild1() {
    this.activateItem(this.child1);
  }

  @action.bound
  selectChild2() {
    this.activateItem(this.child2);
  }
}
