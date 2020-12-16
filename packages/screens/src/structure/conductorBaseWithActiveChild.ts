import { computed, observable, runInAction } from "mobx";
import NavigationConfiguration from "../navigation/navigationConfiguration";
import ConductorBase from "./conductorBase";
import { canDeactivate } from "./helpers";
import { IChild, IHasActiveChild, IScreen } from "./types";

export default abstract class ConductorBaseWithActiveChild<TChild extends IScreen & IChild>
  extends ConductorBase<TChild>
  implements IHasActiveChild<TChild> {
  @observable private activeChildValue?: TChild;
  @computed get activeChild() {
    return this.activeChildValue;
  }

  get canBeNavigationActiveScreen() {
    return !this.activeChildValue;
  }

  async canDeactivate(isClosing: boolean) {
    if (this.activeChild) {
      return canDeactivate(this.activeChild, isClosing);
    } else {
      return true;
    }
  }

  async tryActivateChild(child: TChild) {
    if (child && this.activeChild === child) {
      if (this.isActive) {
        await child.activate();
      }

      return true;
    }

    return await this.changeActiveChild(child, false);
  }

  protected async changeActiveChild(newChild: TChild | undefined, closePrevious: boolean): Promise<boolean> {
    const currentChild = this.activeChild;
    if (currentChild) {
      await currentChild.deactivate(closePrevious);
    }

    runInAction(() => {
      this.connectChild(newChild);
      this.activeChildValue = newChild;
    });

    if (newChild) {
      if (this.isActive) {
        await newChild.activate();
      } else {
        await newChild.initialize();
      }
    }

    if (this.isActive && !newChild && NavigationConfiguration.onScreenChanged) {
      NavigationConfiguration.onScreenChanged(this);
    }

    return true;
  }

  protected async onActivate() {
    if (this.activeChild) {
      await this.activeChild.activate();
    }
  }
}
