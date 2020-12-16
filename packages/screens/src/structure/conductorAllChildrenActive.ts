import { bound } from "@frui.ts/helpers";
import { IArrayWillChange, IArrayWillSplice, intercept, observable, runInAction } from "mobx";
import ConductorBase from "./conductorBase";
import { canDeactivate, isActivatable } from "./helpers";
import { IChild, IScreen } from "./types";

export default class ConductorAllChildrenActive<TChild extends IScreen & IChild> extends ConductorBase<TChild> {
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
      if (this.isActive) {
        await child.activate();
      } else {
        await child.initialize();
      }
    }

    return true;
  }

  protected onActivate() {
    return Promise.all(this.children.map(x => x.activate()));
  }
  protected async onDeactivate(isClosing: boolean) {
    for (const child of this.children) {
      await child.deactivate(isClosing);
    }

    if (isClosing) {
      runInAction(() => this.children.clear());
    }
  }

  protected connectChild(child: TChild) {
    if (child && !this.children.includes(child)) {
      runInAction(() => this.children.push(child));
    }
  }

  protected findNavigationChild(name: string | undefined): Promise<TChild | undefined> | TChild | undefined {
    return this.children.find(x => x.navigationName === name);
  }

  protected async deactivateChild(child: TChild, isClosing: boolean) {
    if (!child) {
      return;
    }

    if (isClosing) {
      await this.closeChildCore(child);
      runInAction(() => this.children.remove(child));
    } else {
      await child.deactivate(isClosing);
    }
  }

  private async closeChildCore(child: TChild) {
    await child.deactivate(true);
  }

  @bound
  private handleChildrenChanged(change: IArrayWillChange<any> | IArrayWillSplice<any>) {
    switch (change.type) {
      case "splice":
        for (const newItem of change.added) {
          super.connectChild(newItem);
          if (this.isActive && isActivatable(newItem)) {
            void newItem.activate();
          }
        }
        break;
      case "update":
        super.connectChild(change.newValue);
        if (this.isActive && isActivatable(change.newValue)) {
          void change.newValue.activate();
        }
        break;
    }
    return change;
  }
}
