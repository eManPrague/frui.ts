import { Screen } from "@frui.ts/screens";

// tslint:disable: no-console
export default class InheritedTestViewModel extends Screen {
  protected onInitialize() {
    console.log("InheritedTestViewModel", "onInitialize");
  }

  protected onActivate() {
    console.log("InheritedTestViewModel", "onActivate");
  }

  protected onDeactivate(close: boolean) {
    console.log("InheritedTestViewModel", "onDeactivate", close);
  }
}
