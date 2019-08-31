import { IHasNavigationName } from "../navigation/types";
import ConductorBaseWithActiveChild from "./conductorBaseWithActiveChild";
import { isActivatable, isDeactivatable } from "./helpers";
import { IChild } from "./types";

export default abstract class ConductorSingleChild<
  TChild extends IChild<any> & IHasNavigationName
> extends ConductorBaseWithActiveChild<TChild> {
  async activateChild(child: TChild) {
    if (child && this.activeChild === child) {
      if (this.isActive && isActivatable(child)) {
        await child.activate();
      }
      return;
    }

    if (this.activeChild) {
      const canCloseCurrentChild = await this.activeChild.canClose();
      if (!canCloseCurrentChild) {
        return;
      }
    }

    if (this.activeChild !== child) {
      await this.changeActiveChild(child, true);
    }
  }

  async deactivateChild(child: TChild, close: boolean) {
    if (!child || this.activeChild !== child) {
      return;
    }

    if (close) {
      const canCloseCurrentChild = await this.activeChild.canClose();
      if (!canCloseCurrentChild) {
        return;
      }

      await this.changeActiveChild(null, close);
    } else {
      if (isDeactivatable(child)) {
        await child.deactivate(false);
      }
    }
  }

  protected async onDeactivate(close: boolean) {
    await this.deactivateChild(this.activeChild, close);
  }
}
