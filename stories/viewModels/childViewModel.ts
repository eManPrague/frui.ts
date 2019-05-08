import Screen from "@src/lifecycle/screen";
import { observable } from "mobx";
import { notifyRoutePathChanged } from "./helpers";

// tslint:disable: no-console
export default class ChildViewModel extends Screen {
  @observable text: string;

  protected onInitialize() {
    console.log(this.name, "onInitialize");
  }

  protected onActivate() {
    console.log(this.name, "onActivate");
    notifyRoutePathChanged(this);
  }

  protected onDeactivate(close: boolean) {
    console.log(this.name, "onDeactivate", close);
  }
}
