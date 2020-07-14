import { bound } from "@frui.ts/helpers";
import { IArrayWillChange, IArrayWillSplice, intercept, IObservableArray, observable, runInAction } from "mobx";
import ConductorBaseWithActiveChild from "./conductorBaseWithActiveChild";
import { canDeactivate } from "./helpers";
import { IChild, IScreen } from "./types";

export default class ConductorOneChildActive<TChild extends IScreen & IChild> extends ConductorBaseWithActiveChild<TChild> {
  readonly children = observable.array<TChild>(undefined, { deep: false });

  constructor() {
    super();
    intercept(this.children, this.handleChildrenChanged);
  }

  async canDeactivate(isClosing: boolean) {
    const affectedChildren = isClosing ? this.children : [this.activeChild]; // optimization

    for (const child of affectedChildren) {
      const canChildDeactivate = await canDeactivate(child, isClosing);
      if (!canChildDeactivate) {
        return false;
      }
    }

    return true;
  }

  protected async deactivateChild(child: TChild | undefined, isClosing: boolean) {
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

  protected async onDeactivate(isClosing: boolean) {
    if (isClosing) {
      for (const child of this.children) {
        await child.deactivate(isClosing);
      }

      this.children.clear();
    } else if (this.activeChild) {
      await this.activeChild.deactivate(isClosing);
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

  private async closeChildCore(child: TChild) {
    if (this.activeChild === child) {
      const currentChildIndex = this.children.indexOf(child);
      const nextChild = this.determineNextChildToActivate(this.children, currentChildIndex);

      await this.changeActiveChild(nextChild, true);
    } else {
      await child.deactivate(true);
    }
  }
  private determineNextChildToActivate(children: IObservableArray<TChild>, lastIndex: number) {
    if (lastIndex > 0) {
      return children[lastIndex - 1];
    } else if (children.length > 1) {
      return children[1];
    } else {
      return undefined;
    }
  }

  @bound
  private handleChildrenChanged(change: IArrayWillChange<any> | IArrayWillSplice<any>) {
    switch (change.type) {
      case "splice":
        for (const newItem of change.added) {
          super.connectChild(newItem);
        }
        break;
      case "update":
        super.connectChild(change.newValue);
        break;
    }
    return change;
  }
}
