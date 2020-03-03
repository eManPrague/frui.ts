import { ScreenBase } from "@frui.ts/screens";
import { observable } from "mobx";
import { notifyRoutePathChanged } from "./helpers";

export default class ChildViewModel extends ScreenBase {
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
