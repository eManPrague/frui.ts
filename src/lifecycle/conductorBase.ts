import { canNavigate, } from "@src/navigation/helpers";
import NavigationPath, { combineNavigationPath, splitNavigationPath } from "@src/navigation/navigationPath";
import { ICanNavigate, IHasNavigationName } from "@src/navigation/types";
import Screen from "./screen";
import { IChild, IConductor } from "./types";

export default abstract class ConductorBase<TChild extends IChild<any> & IHasNavigationName> extends Screen implements IConductor<TChild>, ICanNavigate {
  protected childNavigationPathClosed = false;

  abstract activateItem(item: TChild): Promise<any>;
  abstract deactivateItem(item: TChild, close: boolean): Promise<any>;

  getNavigationPath(item: TChild): NavigationPath {
    // TODO cache currentNavigationPath
    const currentNavigationPath = this.parent && canNavigate(this.parent) && this.parent.getNavigationPath(this);
    const pathBase = currentNavigationPath ? currentNavigationPath.path : this.navigationName;
    const isPathClosed = currentNavigationPath ? currentNavigationPath.isClosed : this.childNavigationPathClosed;

    return {
      path: isPathClosed ? pathBase : combineNavigationPath(pathBase, item.navigationName),
      isClosed: isPathClosed,
    };
  }

  async navigate(path: string) {
    const segments = splitNavigationPath(path);
    const childToActivate = await this.getChild(segments[0]);
    if (childToActivate) {
      await this.activateItem(childToActivate);
      if (canNavigate(childToActivate)) {
        await childToActivate.navigate(segments[1]);
      }
    }
  }

  protected abstract getChild(navigationName: string): Promise<TChild>;

  protected ensureChildItem(item: TChild) {
    if (item) {
      item.parent = this;
    }
  }
}
