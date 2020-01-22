// tslint:disable: member-ordering
import { canApplyNavigationParams, canNavigate, getNavigationParams } from "../navigation/helpers";
import { combineNavigationPath, NavigationPath, splitNavigationPath } from "../navigation/navigationPath";
import { ICanNavigate, IHasNavigationName } from "../navigation/types";
import ScreenBase from "./screenBase";
import { IChild, IConductor } from "./types";

function combineObjects(a: any, b: any) {
  if (a && b) {
    return Object.assign(a, b);
  } else {
    return a || b;
  }
}

export default abstract class ConductorBase<TChild extends IChild<any> & IHasNavigationName> extends ScreenBase
  implements IConductor<TChild>, ICanNavigate {
  protected childNavigationPathClosed = false;

  abstract activateChild(child: TChild): Promise<any> | void;
  protected abstract deactivateChild(child: TChild, close: boolean): Promise<any> | void;

  closeChild(child: TChild) {
    return this.deactivateChild(child, true);
  }

  // navigation

  getCurrentNavigationPath(): NavigationPath {
    // TODO cache currentNavigationPath
    const currentParams = getNavigationParams(this);
    const pathFromParent =
      this.parent && canNavigate(this.parent) && this.parent.getChildNavigationPath(this, currentParams);

    if (pathFromParent) {
      return {
        path: pathFromParent.path,
        params: combineObjects(pathFromParent.params, currentParams),
        isClosed: pathFromParent.isClosed || this.childNavigationPathClosed,
      };
    } else {
      return {
        path: this.navigationName,
        params: currentParams,
        isClosed: this.childNavigationPathClosed,
      };
    }
  }

  getChildNavigationPath(child: TChild, params: any): NavigationPath {
    const currentPath = this.getCurrentNavigationPath();
    if (currentPath.isClosed) {
      return currentPath;
    } else {
      return {
        path: combineNavigationPath(currentPath.path, child.navigationName),
        params: combineObjects(currentPath.params, params),
        isClosed: currentPath.isClosed,
      };
    }
  }

  async navigate(path: string | undefined, params: any) {
    const segments = splitNavigationPath(path);
    const childToActivate = await this.findNavigationChild(segments[0]);

    if (childToActivate) {
      await this.activateChild(childToActivate);

      if (params && canApplyNavigationParams(childToActivate)) {
        try {
          const paramsHandlePromise = childToActivate.applyNavigationParams(params);
          if (paramsHandlePromise) {
            await paramsHandlePromise;
          }
        } catch (error) {
          // tslint:disable-next-line: no-console
          console.error(error);
        }
      }

      if (canNavigate(childToActivate)) {
        await childToActivate.navigate(segments[1], params);
      }
    }

    const childNavigatedPromise = this.onChildNavigated(childToActivate);
    if (childNavigatedPromise) {
      await childNavigatedPromise;
    }
  }

  protected findNavigationChild(navigationName: string | undefined): Promise<TChild | undefined> | TChild | undefined {
    return undefined;
  }

  // tslint:disable-next-line: no-empty
  protected onChildNavigated(child: TChild | undefined): Promise<any> | void {}

  protected connectChild(item: TChild | undefined) {
    if (item) {
      item.parent = this;
    }
  }
}
