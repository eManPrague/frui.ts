import Screen from "@src/lifecycle/screen";
import { observable } from "mobx";

// tslint:disable: no-console
export default class ChildViewModel extends Screen {
  @observable title: string;
  @observable text: string;

  protected onInitialize() {
    console.log(this.title, "onInitialize");
  }

  protected onActivate() {
    console.log(this.title, "onActivate");
  }

  protected onDeactivate(close: boolean) {
    console.log(this.title, "onDeactivate", close);
  }
}
