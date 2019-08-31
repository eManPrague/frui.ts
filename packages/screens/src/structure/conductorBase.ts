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

  getNavigationPath(child: TChild): NavigationPath {
    // TODO cache currentNavigationPath
    const currentNavigationPath = this.parent && canNavigate(this.parent) && this.parent.getNavigationPath(this);
    const pathBase = currentNavigationPath ? currentNavigationPath.path : this.navigationName;
    const isPathClosed = currentNavigationPath ? currentNavigationPath.isClosed : this.childNavigationPathClosed;

    return {
      path: isPathClosed ? pathBase : combineNavigationPath(pathBase, child.navigationName),
      isClosed: isPathClosed,
    };
  }

  async navigate(path: string) {
    const segments = splitNavigationPath(path);
    const childToActivate = await this.findChild(segments[0]);
    if (childToActivate) {
      await this.activateChild(childToActivate);
      if (canNavigate(childToActivate)) {
        await childToActivate.navigate(segments[1]);
      }
    }
  }

  protected abstract findChild(navigationName: string): Promise<TChild>;

  protected connectChild(item: TChild) {
    if (item) {
      item.parent = this;
    }
  }
}
