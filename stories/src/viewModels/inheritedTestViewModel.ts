import { ScreenBase } from "@frui.ts/screens";

// tslint:disable: no-console
export default class InheritedTestViewModel extends ScreenBase {
  constructor(public name = "InheritedTestViewModel") {
    super();
  }

  protected onInitialize() {
    console.log("InheritedTestViewModel", this.name, "onInitialize");
  }

  protected onActivate() {
    console.log("InheritedTestViewModel", this.name, "onActivate");
  }

  protected onDeactivate(close: boolean) {
    console.log("InheritedTestViewModel", this.name, "onDeactivate", close);
  }
}
