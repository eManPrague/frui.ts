import { bound } from "@frui.ts/helpers";
import { IArraySplice, IArrayWillChange, intercept, IObservableArray, observable, runInAction } from "mobx";
import { IHasNavigationName } from "../navigation/types";
import ConductorBaseWithActiveItem from "./conductorBaseWithActiveItem";
import { isActivatable, isDeactivatable } from "./helpers";
import { IChild } from "./types";

export default class ConductorOneChildActive<TChild extends IChild<any> & IHasNavigationName> extends ConductorBaseWithActiveItem<TChild> {
  readonly items = observable.array<TChild>(undefined, { deep: false });

  constructor() {
    super();
    intercept(this.items, this.handleItemsChanged);
  }

  async activateItem(item: TChild) {
    if (item && this.activeItem === item) {
      if (this.isActive && isActivatable(item)) {
        await item.activate();
      }
      return;
    }

    await this.changeActiveItem(item, false);
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
        await this.closeItemCore(item);
        runInAction(() => this.items.remove(item));
      }
      else {
        canCloseSelf = false;
      }
    }

    return canCloseSelf;
  }

  protected getChild(name: string) {
    const child = this.items.find(x => x.navigationName === name);
    return Promise.resolve(child);
  }

  protected async onDeactivate(close: boolean) {
    if (close) {
      for (const item of this.items) {
        if (isDeactivatable(item)) {
          await item.deactivate(true);
        }
      }

      this.items.clear();
    }
    else {
      await this.deactivateItem(this.activeItem, false);
    }
  }

  protected ensureChildItem(item: TChild) {
    if (item) {
      const currentIndex = this.items.indexOf(item);
      if (currentIndex === -1) {
        runInAction(() => this.items.push(item));
        super.ensureChildItem(item);
      }
    }
  }

  private async closeItemCore(item: TChild) {
    if (this.activeItem === item) {
      const currentItemIndex = this.items.indexOf(item);
      const nextItem = this.determineNextItemToActivate(this.items, currentItemIndex);

      await this.changeActiveItem(nextItem, true);
    }
    else {
      if (isDeactivatable(item)) {
        await item.deactivate(true);
      }
    }
  }

  private determineNextItemToActivate(items: IObservableArray<TChild>, lastIndex: number) {
    if (lastIndex > 0) {
      return items[lastIndex - 1];
    }
    else if (items.length > 1) {
      return items[1];
    }
    else {
      return null;
    }
  }

  @bound private handleItemsChanged(change: IArrayWillChange<any> | IArraySplice<any>) {
    switch (change.type) {
      case "splice":
        for (const newItem of change.added) {
          super.ensureChildItem(newItem);
        }
        break;
      case "update":
        super.ensureChildItem(change.newValue);
        break;
    }
    return change;
  }
}
