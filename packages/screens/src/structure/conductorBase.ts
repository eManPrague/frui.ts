import { canNavigate } from "../navigation/helpers";
import { combinePath, splitUrlSegments } from "../navigation/navigationPath";
import { ICanNavigate, INavigationParent } from "../navigation/types";
import { canDeactivate } from "./helpers";
import ScreenBase from "./screenBase";
import { IChild, IConductor, IScreen } from "./types";

export default abstract class ConductorBase<TChild extends IScreen & IChild> extends ScreenBase
  implements IConductor<TChild>, ICanNavigate, INavigationParent<TChild> {
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

  protected childNavigationPathClosed = false;

  getChildNavigationPath(child: TChild | string | number, childParams?: any) {
    const currentPath = this.getNavigationPath();

    if (this.childNavigationPathClosed) {
      return currentPath;
    } else {
      const childNavigationName = (child as TChild).navigationName ?? (child as string);
      return combinePath(currentPath, childNavigationName, childParams);
    }
  }

  async navigate(subPath: string | undefined, params: any) {
    const segments = splitUrlSegments(subPath);
    const childToActivate = await this.findNavigationChild(segments[0]);

    if (childToActivate) {
      await this.tryActivateChild(childToActivate);

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
