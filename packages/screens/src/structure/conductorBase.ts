import { canNavigate } from "../navigation/helpers";
import { combineNavigationPath, NavigationPath, splitNavigationPath } from "../navigation/navigationPath";
import { ICanNavigate, IHasNavigationName } from "../navigation/types";
import ScreenBase from "./screenBase";
import { IChild, IConductor } from "./types";

export default abstract class ConductorBase<TChild extends IChild<any> & IHasNavigationName> extends ScreenBase
  implements IConductor<TChild>, ICanNavigate {
  protected childNavigationPathClosed = false;

  abstract activateChild(child: TChild): Promise<any>;
  abstract deactivateChild(child: TChild, close: boolean): Promise<any>;

  getCurrentNavigationPath(): NavigationPath {
    // TODO cache currentNavigationPath
    const pathFromParent = this.parent && canNavigate(this.parent) && this.parent.getChildNavigationPath(this);
    const path = pathFromParent ? pathFromParent.path : this.navigationName;
    const isPathClosed = pathFromParent ? pathFromParent.isClosed : this.childNavigationPathClosed;

    return {
      path,
      isClosed: isPathClosed,
    };
  }

  getChildNavigationPath(child: TChild): NavigationPath {
    const currentPath = this.getCurrentNavigationPath();
    if (currentPath.isClosed) {
      return currentPath;
    } else {
      return {
        path: combineNavigationPath(currentPath.path, child.navigationName),
        isClosed: false,
      };
    }
  }

  async navigate(path: string) {
    const segments = splitNavigationPath(path);
    const childToActivate = await this.findChild(segments[0]);
    if (childToActivate) {
      await this.activateChild(childToActivate);
      if (segments[1] && canNavigate(childToActivate)) {
        await childToActivate.navigate(segments[1]);
      }
    }
  }

  protected abstract findChild(navigationName: string): Promise<TChild | undefined>;

  protected connectChild(item: TChild) {
    if (item) {
      item.parent = this;
    }
  }
}
