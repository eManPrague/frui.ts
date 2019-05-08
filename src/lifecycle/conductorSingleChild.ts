import { IHasNavigationName } from "@src/navigation/types";
import ConductorBaseWithActiveItem from "./conductorBaseWithActiveItem";
import { isActivatable, isDeactivatable } from "./helpers";
import { IChild } from "./types";

export default abstract class ConductorSingleChild<TChild extends IChild<any> & IHasNavigationName> extends ConductorBaseWithActiveItem<TChild> {
  async activateItem(item: TChild) {
    if (item && this.activeItem === item) {
      if (this.isActive && isActivatable(item)) {
        await item.activate();
      }
      return;
    }

    if (this.activeItem) {
      const canCloseCurrentItem = await this.activeItem.canClose();
      if (!canCloseCurrentItem) {
        return;
      }
    }

    if (this.activeItem !== item) {
      await this.changeActiveItem(item, true);
    }
  }

  async deactivateItem(item: TChild, close: boolean) {
    if (!item || this.activeItem !== item) {
      return;
    }

    if (close) {
      const canCloseCurrentItem = await this.activeItem.canClose();
      if (!canCloseCurrentItem) {
        return;
      }

      await this.changeActiveItem(null, close);
    }
    else {
      if (isDeactivatable(item)) {
        await item.deactivate(false);
      }
    }
  }

  protected async onDeactivate(close: boolean) {
    await this.deactivateItem(this.activeItem, close);
  }
}
