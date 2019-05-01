import { screen } from "@src/lifecycle/screen";
// tslint:disable: no-console
@screen
export default class DecoratedTestViewModel {
  protected onInitialize() {
    console.log("DecoratedTestViewModel", "onInitialize");
  }

  protected onActivate() {
    console.log("DecoratedTestViewModel", "onActivate");
  }

  protected onDeactivate(close: boolean) {
    console.log("DecoratedTestViewModel", "onDeactivate", close);
  }
}
