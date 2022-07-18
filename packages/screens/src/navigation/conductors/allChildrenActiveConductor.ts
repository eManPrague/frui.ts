import type { IArrayWillChange, IArrayWillSplice } from "mobx";
import { intercept, observable } from "mobx";
import { getNavigator } from "../../screens/screenBase";
import LifecycleScreenNavigatorBase from "../lifecycleScreenNavigatorBase";
import type ScreenLifecycleEventHub from "../screenLifecycleEventHub";

export default class AllChildrenActiveConductor<
  TChild = unknown,
  TNavigationParams extends Record<string, string | undefined> = Record<string, string | undefined>,
  TScreen = any,
  TLocation = unknown
> extends LifecycleScreenNavigatorBase<TNavigationParams, TScreen, TLocation> {
  readonly children: TChild[];

  constructor(screen?: TScreen, navigationName?: string, navigationPrefix?: string, eventHub?: ScreenLifecycleEventHub<TScreen>) {
    super(screen, navigationName, navigationPrefix, eventHub);

    const children = observable.array<TChild>([], { deep: false });
    intercept(children, this.handleChildrenChanged);
    this.children = children;
  }

  private handleChildrenChanged = (change: IArrayWillChange<TChild> | IArrayWillSplice<TChild>) => {
    switch (change.type) {
      case "splice":
        for (const newItem of change.added) {
          this.connectChild(newItem);
        }
        break;
      case "update":
        this.connectChild(change.newValue);
        break;
    }
    return change;
  };

  connectChild(child: TChild) {
    const navigator = getNavigator(child);
    if (navigator) {
      navigator.parent = this;
    }
  }

  // TODO distribute activate on all children

  // TODO canClose property distributes closing to its children

  // TODO deactivate all children on closing
}
