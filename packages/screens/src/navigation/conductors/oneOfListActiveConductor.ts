import type { IArrayWillChange, IArrayWillSplice } from "mobx";
import { observable } from "mobx";
import type { FindChildResult } from "../../models/findChildResult";
import type { NavigationContext } from "../../models/navigationContext";
import { getNavigator } from "../../screens/screenBase";
import type ScreenLifecycleEventHub from "../screenLifecycleEventHub";
import type { LifecycleScreenNavigator } from "../types";
import ActiveChildConductor from "./activeChildConductor";

export default class OneOfListActiveConductor<
  TChild = unknown,
  TScreen = any,
  TNavigationParams extends Record<string, string | undefined> = Record<string, string | undefined>,
  TLocation = unknown
> extends ActiveChildConductor<TChild, TScreen, TNavigationParams, TLocation> {
  readonly children: TChild[];

  /** When set to `true`, navigating directly to the conductor (with no child path specified) activates the previously set `activeChild`. */
  preserveActiveChild = false;

  constructor(screen?: TScreen, navigationName?: string, navigationPrefix?: string, eventHub?: ScreenLifecycleEventHub<TScreen>) {
    super(screen, navigationName, navigationPrefix, eventHub);

    const children = observable.array<TChild>([], { deep: false });
    children.intercept(this.handleChildrenChanged);
    this.children = children;
  }

  canChangeActiveChild = async (
    context: NavigationContext<TScreen, TNavigationParams, TLocation>,
    currentChild: TChild | undefined
  ) => {
    const pathElementsToSkip = this.getNavigationStateLength();
    const newNavigationName = context.path[pathElementsToSkip]?.name;
    const activeChildNavigator = getNavigator<LifecycleScreenNavigator>(this.activeChild);

    if (!activeChildNavigator || activeChildNavigator.navigationName === newNavigationName) {
      return true;
    }

    return activeChildNavigator.canDeactivate ? activeChildNavigator.canDeactivate(false) : true;
  };

  findNavigationChild = (context: NavigationContext<TScreen, TNavigationParams, TLocation>, currentChild: TChild | undefined) => {
    const pathElementsToSkip = this.getNavigationStateLength();
    const searchedNavigationName = context.path[pathElementsToSkip]?.name;
    const newChild = this.findChild(searchedNavigationName);
    return { newChild, closePrevious: false } as FindChildResult<TChild>;
  };

  private findChild(navigationName: string | undefined) {
    const child =
      navigationName !== undefined ? this.children.find(x => getNavigator(x)?.navigationName === navigationName) : undefined;

    if (child || !this.preserveActiveChild) {
      return child;
    }

    return this.activeChild ?? this.children[0];
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
