import bound from "@src/helpers/bound";
import { IArraySplice, IArrayWillChange, intercept, observable, runInAction } from "mobx";
import ConductorBase from "./conductorBase";
import { isActivatable, isDeactivatable } from "./helpers";
import { IChild } from "./types";

export default class ConductorAllChildrenActive<TChild extends IChild<any>> extends ConductorBase<TChild> {
  readonly items = observable.array();

  constructor() {
    super();
    intercept(this.items, this.handleItemsChanged);
  }

  async activateItem(item: TChild) {
    if (!item) {
      return;
    }

    const currentIndex = this.items.indexOf(item);
    if (currentIndex === -1) {
      runInAction(() => this.items.push(item));
    }
  }

  async deactivateItem(item: TChild, close: boolean) {
    if (!item) {
      return;
    }

    if (!close) {
      if (isDeactivatable(item)) {
        await item.deactivate(false);
      }
      return;
    }
    else {
      const canClose = await item.canClose();
      if (canClose) {
        await this.closeItemCore(item);
        runInAction(() => this.items.remove(item));
      }
    }
  }

  async canClose() {
    let canCloseSelf = true;
    for (const item of this.items.slice()) {
      const canClose = await item.canClose();
      if (canClose) {
        this.closeItemCore(item);
        runInAction(() => this.items.remove(item));
      }
      else {
        canCloseSelf = false;
      }
    }

    return canCloseSelf;
  }

  protected onActivate() {
    const itemsToActivate = this.items.filter(isActivatable);
    return Promise.all(itemsToActivate.map(x => x.activate()));
  }

  protected async onDeactivate(close: boolean) {
    for (const item of this.items) {
      if (isDeactivatable(item)) {
        await item.deactivate(close);
      }
    }

    if (close) {
      this.items.clear();
    }
  }

  private async closeItemCore(item: TChild) {
    if (isDeactivatable(item)) {
      await item.deactivate(true);
    }
  }

  @bound private handleItemsChanged(change: IArrayWillChange<any> | IArraySplice<any>) {
    switch (change.type) {
      case "splice":
        for (const newItem of change.added) {
          super.ensureChildItem(newItem);
          if (this.isActive && isActivatable(newItem)) {
            newItem.activate();
          }
        }
        break;
      case "update":
        super.ensureChildItem(change.newValue);
        if (this.isActive && isActivatable(change.newValue)) {
          change.newValue.activate();
        }
        break;
    }
    return change;
  }
}
