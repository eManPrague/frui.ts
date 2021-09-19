import { IArrayWillChange, IArrayWillSplice, observable } from "mobx";
import { getNavigator } from "../../screens/screenBase";
import LifecycleScreenNavigatorBase from "../lifecycleScreenNavigatorBase";
import ScreenLifecycleEventHub from "../screenLifecycleEventHub";

export default class AllChildrenActiveConductor<
  TScreen = unknown,
  TChild = unknown,
  TNavigationParams extends Record<string, string> = Record<string, string>
> extends LifecycleScreenNavigatorBase<TScreen, TNavigationParams> {
  readonly children: TChild[];

  constructor(screen?: TScreen, eventHub?: ScreenLifecycleEventHub<TScreen>) {
    super(screen, eventHub);

    const children = observable.array<TChild>([], { deep: false });
    children.intercept(this.handleChildrenChanged);
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

  protected connectChild(child: TChild) {
    const navigator = getNavigator(child);
    if (navigator) {
      navigator.parent = this;
    }
  }

  // TODO distribute activate on all children

  // TODO canClose property distributes closing to its children

  // TODO deactivate all children on closing
}
