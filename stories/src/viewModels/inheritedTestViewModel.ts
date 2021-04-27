import { ScreenBase } from "@frui.ts/screens";

export default class InheritedTestViewModel extends ScreenBase {
  constructor(name = "InheritedTestViewModel") {
    super();
    this.nameValue = name;
  }

  protected onInitialize() {
    console.log("InheritedTestViewModel", this.name, "onInitialize");
  }

  protected onActivate() {
    console.log("InheritedTestViewModel", this.name, "onActivate");
  }

  protected onDeactivate(isClosing: boolean) {
    console.log("InheritedTestViewModel", this.name, "onDeactivate", isClosing);
  }
}
