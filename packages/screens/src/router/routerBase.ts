import type PathElement from "../models/pathElements";
import type { ScreenNavigator } from "../navigation/types";

export default abstract class RouterBase {
  rootNavigator?: ScreenNavigator;

  constructor(rootNavigator?: ScreenNavigator) {
    this.rootNavigator = rootNavigator;
  }

  protected getCurrentPath() {
    const path: PathElement[] = [];

    let navigator = this.rootNavigator;
    while (navigator) {
      path.push(navigator.getNavigationState());
      navigator = navigator.getPrimaryChild();
    }

    return path;
  }

  protected getPathForChild(parent: ScreenNavigator, child: ScreenNavigator | undefined) {
    const path: PathElement[] = [];

    const childPath = child?.getNavigationState();
    if (childPath) {
      path.push(childPath);
    }

    let navigator: ScreenNavigator | undefined = parent;
    while (navigator) {
      path.unshift(navigator.getNavigationState());
      navigator = navigator.parent;
    }

    return path;
  }

  protected cloneWithChildPath(path: PathElement[], child: ScreenNavigator | undefined) {
    const childPath = child?.getNavigationState();
    return childPath ? [...path, childPath] : path;
  }
}
