import { combine, hasNavigationName } from "@src/navigation/helpers";
import { NavigationPath } from "@src/navigation/types";
import Screen from "./screen";
import { IChild, IConductor } from "./types";

export default abstract class ConductorBase<TChild extends IChild<any>> extends Screen implements IConductor<TChild> {
  protected childNavigationPathClosed = false;

  abstract activateItem(item: TChild): Promise<any>;
  abstract deactivateItem(item: TChild, close: boolean): Promise<any>;

  getNavigationPath(item: TChild): NavigationPath {
    // TODO cache currentNavigationPath
    const currentNavigationPath = this.parent && this.parent.getNavigationPath(this);
    const pathBase = currentNavigationPath ?
      currentNavigationPath.path :
      (this.navigationName !== undefined ? this.navigationName : this.constructor.name.replace("ViewModel", ""));
    const itemNavigationName = hasNavigationName(item) ? item.navigationName : item.constructor.name;
    const isPathClosed = currentNavigationPath ? currentNavigationPath.isClosed : this.childNavigationPathClosed;

    return {
      path: isPathClosed ? pathBase : combine(pathBase, itemNavigationName),
      isClosed: isPathClosed,
    };
  }

  protected ensureChildItem(item: TChild) {
    if (item) {
      item.parent = this;
    }
  }
}
