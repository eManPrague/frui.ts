import { bound } from "@frui.ts/helpers";
import { IArraySplice, IArrayWillChange, intercept, observable, runInAction } from "mobx";
import { IHasNavigationName } from "../navigation/types";
import ConductorBase from "./conductorBase";
import { isActivatable, isDeactivatable } from "./helpers";
import { IActivatable, IChild } from "./types";

export default class ConductorAllChildrenActive<TChild extends IChild<any> & IHasNavigationName> extends ConductorBase<
  TChild
> {
  readonly children = observable.array<TChild>(undefined, { deep: false });
  protected childNavigationPathClosed = true;

  constructor() {
    super();
    intercept(this.children, this.handleChildrenChanged);
  }

  async activateChild(child: TChild) {
    if (!child) {
      return;
    }

    const currentIndex = this.children.indexOf(child);
    if (currentIndex === -1) {
      runInAction(() => this.children.push(child));
    }
  }

  async deactivateChild(child: TChild, close: boolean) {
    if (!child) {
      return;
    }

    if (!close) {
      if (isDeactivatable(child)) {
        await child.deactivate(false);
      }
      return;
    } else {
      const canClose = await child.canClose();
      if (canClose) {
        await this.closeChildCore(child);
        runInAction(() => this.children.remove(child));
      }
    }
  }

  async canClose() {
    let canCloseSelf = true;
    for (const child of this.children.slice()) {
      const canClose = await child.canClose();
      if (canClose) {
        this.closeChildCore(child);
        runInAction(() => this.children.remove(child));
      } else {
        canCloseSelf = false;
      }
    }

    return canCloseSelf;
  }

  protected getChildForNavigation(name: string): Promise<TChild | undefined> {
    const child = this.children.find(x => x.navigationName === name);
    return Promise.resolve(child);
  }

  protected onActivate() {
    const childrenToActivate = (this.children.filter(isActivatable) as any) as IActivatable[];
    return Promise.all(childrenToActivate.map(x => x.activate()));
  }

  protected async onDeactivate(close: boolean) {
    for (const child of this.children) {
      if (isDeactivatable(child)) {
        await child.deactivate(close);
      }
    }

    if (close) {
      this.children.clear();
    }
  }

  private async closeChildCore(child: TChild) {
    if (isDeactivatable(child)) {
      await child.deactivate(true);
    }
  }

  @bound private handleChildrenChanged(change: IArrayWillChange<any> | IArraySplice<any>) {
    switch (change.type) {
      case "splice":
        for (const newItem of change.added) {
          super.connectChild(newItem);
          if (this.isActive && isActivatable(newItem)) {
            newItem.activate();
          }
        }
        break;
      case "update":
        super.connectChild(change.newValue);
        if (this.isActive && isActivatable(change.newValue)) {
          change.newValue.activate();
        }
        break;
    }
    return change;
  }
}
