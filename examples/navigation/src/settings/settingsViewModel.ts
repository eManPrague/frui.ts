import type { IViewModel } from "@frui.ts/views";
import { makeObservable, observable } from "mobx";

export default class SettingsViewModel implements IViewModel<unknown> {
  @observable
  text = crypto.randomUUID();

  constructor() {
    makeObservable(this);
  }

  onInitialize(context: unknown) {
    console.log("settings on initialize", this.text, context);
  }

  onActivate(context: unknown) {
    console.log("settings on activate", this.text, context);
  }

  onDeactivate(context: unknown) {
    console.log("settings on deactivate", this.text, context);
  }
}
