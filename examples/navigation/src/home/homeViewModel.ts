import type { IViewModel } from "@frui.ts/views";
import { action, makeObservable, observable } from "mobx";

export default class HomeViewModel implements IViewModel {
  text = "foo";

  @observable
  counter = 0;

  constructor() {
    makeObservable(this);
  }

  onInitialize(): Promise<unknown> {
    setInterval(
      action(() => this.counter++),
      1000
    );

    return new Promise(resolve => setTimeout(resolve, 2000));
  }
}
