import Screen from "@src/lifecycle/screen";
import { observable } from "mobx";

// tslint:disable: no-console
export default class ChildViewModel extends Screen {
  @observable text: string;

  protected onInitialize() {
    console.log(this.name, "onInitialize");
  }

  protected onActivate() {
    console.log(this.name, "onActivate");

    const navigationPath = this.parent.getNavigationPath(this);
    console.log("navigation", navigationPath.path, navigationPath.isClosed);
  }

  protected onDeactivate(close: boolean) {
    console.log(this.name, "onDeactivate", close);
  }
}
