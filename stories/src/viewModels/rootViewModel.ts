import { ConductorOneChildActive } from "@frui.ts/screens";
import { action, observable } from "mobx";
import AllChildrenActiveViewModel from "./allChildrenActiveViewModel";
import OneChildActiveViewModel from "./oneChildActiveViewModel";
import SingleChildViewModel from "./singleChildViewModel";

export default class RootViewModel extends ConductorOneChildActive<any> {
  @observable navigationPath = "";

  constructor() {
    super();

    this.navigationName = "";

    const module1 = new SingleChildViewModel();
    module1.name = "Module 1";
    module1.navigationName = "ModuleOne";
    const module2 = new OneChildActiveViewModel();
    module2.name = "Module 2";
    module2.navigationName = "ModuleTwo";
    const module3 = new AllChildrenActiveViewModel();
    module3.name = "Module 3";
    module3.navigationName = "ModuleThree";

    this.children.push(module1, module2, module3);

    window.addEventListener("navigated", (e: any) => {
      this.setNavigationPath(e.detail.path);
    });
  }

  @action.bound
  setNavigationPath(path: string) {
    this.navigationPath = path;
  }

  @action.bound
  startNavigation() {
    return this.navigate(this.navigationPath, undefined);
  }
}
