import { observable } from "mobx";
import { NavigationContext } from "../../models/navigationContext";
import { getNavigator } from "../../screens/screenBase";
import { LifecycleScreenNavigator } from "../types";
import ActiveChildConductor from "./activeChildConductor";

export default class OneOfListActiveConductor<
  TScreen = unknown,
  TChild = unknown,
  TNavigationParams extends Record<string, string> = Record<string, string>
> extends ActiveChildConductor<TScreen, TChild, TNavigationParams> {
  readonly children: TChild[] = observable([]);

  canChangeActiveChild = async (context: NavigationContext<TScreen>, currentChild: TChild | undefined) => {
    const newNavigationName = context.path[0]?.name;
    const activeChildNavigator = getNavigator<LifecycleScreenNavigator>(this.activeChild);

    if (!activeChildNavigator || activeChildNavigator?.navigationName === newNavigationName) {
      return true;
    }

    return activeChildNavigator.canDeactivate ? activeChildNavigator.canDeactivate(false) : true;
  };

  findNavigationChild = (context: NavigationContext<TScreen>, currentChild: TChild | undefined) => {
    const searchedNavigationName = context.path[0]?.name;
    const newChild = this.findChild(searchedNavigationName);
    const result = { newChild, closePrevious: false };
    return Promise.resolve(result);
  };

  private findChild(navigationName: string) {
    return navigationName !== undefined ? this.children.find(x => getNavigator(x)?.navigationName === navigationName) : undefined;
  }

  // TODO canClose property distributes closing to its children

  // TODO deactivate all children on closing
}
