import { canApplyNavigationParams, canNavigate, getNavigationParams } from "../navigation/helpers";
import { combineNavigationPath, NavigationPath, splitNavigationPath } from "../navigation/navigationPath";
import { ICanNavigate, IHasNavigationName } from "../navigation/types";
import { canDeactivate } from "./helpers";
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

  abstract tryActivateChild(child: TChild): Promise<boolean> | boolean;
  protected abstract deactivateChild(child: TChild, isClosing: boolean): Promise<any>;

  protected async tryDeactivateChild(child: TChild, isClosing: boolean) {
    const canContinue = await canDeactivate(child, isClosing);
    if (canContinue) {
      await this.deactivateChild(child, isClosing);
      return true;
    } else {
      return false;
    }
  }

  closeChild(child: TChild, forceClose = false): Promise<boolean> | boolean {
    return forceClose ? this.deactivateChild(child, true).then(() => true) : this.tryDeactivateChild(child, true);
  }

  // navigation

  getCurrentNavigationPath(): NavigationPath {
    // TODO cache currentNavigationPath
    const currentParams = getNavigationParams(this);
    const pathFromParent = this.parent && canNavigate(this.parent) && this.parent.getChildNavigationPath(this, currentParams);

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
      await this.tryActivateChild(childToActivate);

      if (params && canApplyNavigationParams(childToActivate)) {
        try {
          const paramsHandlePromise = childToActivate.applyNavigationParams(params);
          if (paramsHandlePromise) {
            await paramsHandlePromise;
          }
        } catch (error) {
          console.error(error);
        }
      }

      if (canNavigate(childToActivate)) {
        await childToActivate.navigate(segments[1], params);
      }
    }

    await this.onChildNavigated(childToActivate);
  }

  protected findNavigationChild(navigationName: string | undefined): Promise<TChild | undefined> | TChild | undefined {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onChildNavigated(child: TChild | undefined): Promise<any> | void {}

  protected connectChild(item: TChild | undefined) {
    if (item) {
      item.parent = this;
    }
  }
}
