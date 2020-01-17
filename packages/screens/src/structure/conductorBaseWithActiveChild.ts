import { computed, observable, runInAction } from "mobx";
import navigationManager from "../navigation/navigationManager";
import { IHasNavigationName } from "../navigation/types";
import ConductorBase from "./conductorBase";
import { isActivatable, isDeactivatable } from "./helpers";
import { IChild, IHasActiveChild } from "./types";

export default abstract class ConductorBaseWithActiveChild<TChild extends IChild<any> & IHasNavigationName>
  extends ConductorBase<TChild>
  implements IHasActiveChild<TChild> {
  @observable private activeChildValue?: TChild;
  @computed get activeChild() {
    return this.activeChildValue;
  }

  get canBeNavigationActiveScreen() {
    return !this.activeChildValue;
  }

  protected async changeActiveChild(newChild: TChild | undefined, closePrevious: boolean) {
    const currentChild = this.activeChild;
    if (currentChild && isDeactivatable(currentChild)) {
      await currentChild.deactivate(closePrevious);
    }

    runInAction(() => {
      this.connectChild(newChild);
      this.activeChildValue = newChild;
    });

    if (this.isActive && newChild && isActivatable(newChild)) {
      await newChild.activate();
    }

    if (this.isActive && !newChild && navigationManager.onActiveScreenChanged) {
      navigationManager.onActiveScreenChanged(this);
    }
  }

  protected async onActivate() {
    if (this.activeChild && isActivatable(this.activeChild)) {
      await this.activeChild.activate();
    }
  }
}
