import { ScreenBase } from "@frui.ts/screens";
import { observable } from "mobx";
import "./helpers";

export default class ChildViewModel extends ScreenBase {
  @observable text: string;

  protected onInitialize() {
    console.log(this.name, "onInitialize");
  }

  protected onActivate() {
    console.log(this.name, "onActivate");
  }

  protected onDeactivate(isClosing: boolean) {
    console.log(this.name, "onDeactivate", isClosing);
  }
}
