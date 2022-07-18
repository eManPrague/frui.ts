import { ScreenBase, SimpleScreenNavigator } from "@frui.ts/screens";
import { action, observable, makeObservable } from "mobx";

export default class CustomersViewModel extends ScreenBase {
  @observable message = "Empty";

  constructor() {
    super();
    makeObservable(this);
    this.navigator = new SimpleScreenNavigator(this);
  }

  @action.bound
  updateText() {
    this.message = new Date().toISOString();
  }

  @action
  onInitialize() {
    this.message = "Initialized";
  }

  @action
  onActivate() {
    this.message = "Activated";
  }

  @action
  onDeactivate() {
    this.message = "Deactivated";
    console.log("Deactivated");
  }
}
