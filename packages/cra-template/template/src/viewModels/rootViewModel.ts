import { ConductorOneChildActive, ScreenBase } from "@frui.ts/screens";
import ModuleViewModel from "./demo/demoViewModel";

export default class RootViewModel extends ConductorOneChildActive<ScreenBase> {
  constructor(private moduleViewModel: ModuleViewModel) {
    super();
    this.children.push(this.moduleViewModel);
  }

  protected onInitialize() {
    if (!this.activeChild && this.children.length) {
      return this.tryActivateChild(this.children[0]);
    }
  }

  closeChild() {
    // children cannot be closed
    return false;
  }
}
