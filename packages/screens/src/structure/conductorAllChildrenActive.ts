import { bound } from "@frui.ts/helpers";
import { IArrayWillChange, IArrayWillSplice, intercept, observable, runInAction } from "mobx";
import { IHasNavigationName } from "../navigation/types";
import ConductorBase from "./conductorBase";
import { canDeactivate, isActivatable, isDeactivatable } from "./helpers";
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

  async canDeactivate(isClosing: boolean) {
    for (const child of this.children) {
      const canChildDeactivate = await canDeactivate(child, isClosing);
      if (!canChildDeactivate) {
        return false;
      }
    }

    return true;
  }

  async tryActivateChild(child: TChild) {
    if (child) {
      this.connectChild(child);
      if (this.isActive && isActivatable(child)) {
        await child.activate();
      }
    }

    return true;
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

  protected connectChild(child: TChild) {
    if (child && !this.children.includes(child)) {
      runInAction(() => this.children.push(child));
    }
  }

  protected findNavigationChild(name: string): Promise<TChild | undefined> | TChild | undefined {
    return this.children.find(x => x.navigationName === name);
  }

  protected async deactivateChild(child: TChild, isClosing: boolean) {
    if (!child) {
      return;
    }

    if (isClosing) {
      await this.closeChildCore(child);
      runInAction(() => this.children.remove(child));
    } else if (isDeactivatable(child)) {
      await child.deactivate(isClosing);
    }
  }

  private async closeChildCore(child: TChild) {
    if (isDeactivatable(child)) {
      await child.deactivate(true);
    }
  }

  @bound private handleChildrenChanged(change: IArrayWillChange<any> | IArrayWillSplice<any>) {
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
