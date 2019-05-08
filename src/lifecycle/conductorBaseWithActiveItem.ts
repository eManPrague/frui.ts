import { IHasNavigationName } from "@src/navigation/types";
import { computed, observable, runInAction } from "mobx";
import ConductorBase from "./conductorBase";
import { isActivatable, isDeactivatable } from "./helpers";
import { IChild, IHasActiveItem } from "./types";

export default abstract class ConductorBaseWithActiveItem<TChild extends IChild<any> & IHasNavigationName>
  extends ConductorBase<TChild> implements IHasActiveItem<TChild> {

    @observable private activeItemValue: TChild;
    @computed get activeItem() {
      return this.activeItemValue;
    }

    protected async changeActiveItem(newItem: TChild, closePrevious: boolean) {
      const currentItem = this.activeItem;
      if (currentItem && isDeactivatable(currentItem))
      {
        await currentItem.deactivate(closePrevious);
      }

      runInAction(() => {
        this.ensureChildItem(newItem);
        this.activeItemValue = newItem;
      });

      if (this.isActive && newItem && isActivatable(newItem)) {
        await newItem.activate();
      }
    }

    protected async onActivate() {
      if (this.activeItem && isActivatable(this.activeItem)) {
        await this.activeItem.activate();
      }
    }
}
