import { bound } from "@frui.ts/helpers";
import { IArraySplice, IArrayWillChange, intercept, IObservableArray, observable, runInAction } from "mobx";
import { IHasNavigationName } from "../navigation/types";
import ConductorBaseWithActiveChild from "./conductorBaseWithActiveChild";
import { isActivatable, isDeactivatable } from "./helpers";
import { IChild } from "./types";

export default class ConductorOneChildActive<
  TChild extends IChild<any> & IHasNavigationName
> extends ConductorBaseWithActiveChild<TChild> {
  readonly children = observable.array<TChild>(undefined, { deep: false });

  constructor() {
    super();
    intercept(this.children, this.handleChildrenChanged);
  }

  async canClose() {
    let canCloseSelf = true;
    const childrenToClose = [] as TChild[];

    for (const child of this.children) {
      const canClose = await child.canClose();
      if (canClose) {
        childrenToClose.push(child);
      } else {
        canCloseSelf = false;
      }
    }

    for (const child of childrenToClose) {
      if (isDeactivatable(child)) {
        await child.deactivate(true);
      }
    }

    if (childrenToClose.length !== this.children.length) {
      runInAction(() => {
        for (const child of childrenToClose) {
          this.children.remove(child);
        }
      });

      this.activateChild(this.children[0]);
    } else {
      runInAction(() => this.children.clear());
    }

    return canCloseSelf;
  }

  async activateChild(child: TChild) {
    if (child && this.activeChild === child) {
      if (this.isActive && isActivatable(child)) {
        await child.activate();
      }
      return;
    }

    this.connectChild(child);
    await this.changeActiveChild(child, false);
  }

  protected async deactivateChild(child: TChild, close: boolean) {
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

  protected connectChild(child: TChild) {
    if (child) {
      const currentIndex = this.children.indexOf(child);
      if (currentIndex === -1) {
        runInAction(() => this.children.push(child));
      }
    }
  }

  protected getChildForNavigation(name: string): Promise<TChild | undefined> {
    const child = this.children.find(x => x.navigationName === name);
    return Promise.resolve(child);
  }

  protected async onDeactivate(close: boolean) {
    if (close) {
      for (const child of this.children) {
        if (isDeactivatable(child)) {
          await child.deactivate(true);
        }
      }

      this.children.clear();
    } else {
      await this.deactivateChild(this.activeChild, false);
    }
  }

  private async closeChildCore(child: TChild) {
    if (this.activeChild === child) {
      const currentChildIndex = this.children.indexOf(child);
      const nextChild = this.determineNextChildToActivate(this.children, currentChildIndex);

      await this.changeActiveChild(nextChild, true);
    } else {
      if (isDeactivatable(child)) {
        await child.deactivate(true);
      }
    }
  }

  private determineNextChildToActivate(children: IObservableArray<TChild>, lastIndex: number) {
    if (lastIndex > 0) {
      return children[lastIndex - 1];
    } else if (children.length > 1) {
      return children[1];
    } else {
      return null;
    }
  }

  @bound private handleChildrenChanged(change: IArrayWillChange<any> | IArraySplice<any>) {
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
