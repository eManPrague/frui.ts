import type { IArrayWillChange, IArrayWillSplice } from "mobx";
import { observable } from "mobx";
import type { NavigationContext } from "../../models/navigationContext";
import { getNavigator } from "../../screens/screenBase";
import type ScreenLifecycleEventHub from "../screenLifecycleEventHub";
import type { LifecycleScreenNavigator } from "../types";
import ActiveChildConductor from "./activeChildConductor";

export default class OneOfListActiveConductor<
  TChild = unknown,
  TScreen = any,
  TNavigationParams extends Record<string, string> = Record<string, string>
> extends ActiveChildConductor<TChild, TScreen, TNavigationParams> {
  readonly children: TChild[];

  /** When set to `true`, navigating directly to the conductor (with no child path specified) activates the previously set `activeChild`. */
  preserveActiveChild = false;

  constructor(screen?: TScreen, eventHub?: ScreenLifecycleEventHub<TScreen>) {
    super(screen, eventHub);

    const children = observable.array<TChild>([], { deep: false });
    children.intercept(this.handleChildrenChanged);
    this.children = children;
  }

  canChangeActiveChild = async (context: NavigationContext<TScreen>, currentChild: TChild | undefined) => {
    const newNavigationName = context.path[1]?.name;
    const activeChildNavigator = getNavigator<LifecycleScreenNavigator>(this.activeChild);

    if (!activeChildNavigator || activeChildNavigator.navigationName === newNavigationName) {
      return true;
    }

    return activeChildNavigator.canDeactivate ? activeChildNavigator.canDeactivate(false) : true;
  };

  findNavigationChild = (context: NavigationContext<TScreen>, currentChild: TChild | undefined) => {
    const searchedNavigationName = context.path[1]?.name;
    const newChild = this.findChild(searchedNavigationName);
    const result = { newChild, closePrevious: false };
    return Promise.resolve(result);
  };

  private findChild(navigationName: string | undefined) {
    if (this.preserveActiveChild && navigationName === undefined) {
      return this.activeChild;
    }

    return navigationName !== undefined ? this.children.find(x => getNavigator(x)?.navigationName === navigationName) : undefined;
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

  // TODO canClose property distributes closing to its children

  // TODO deactivate all children on closing
}
