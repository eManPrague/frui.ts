import ConductorBaseWithActiveChild from "./conductorBaseWithActiveChild";
import { IChild, IScreen } from "./types";

export default abstract class ConductorSingleChild<TChild extends IScreen & IChild> extends ConductorBaseWithActiveChild<TChild> {
  protected async deactivateChild(child: TChild | undefined, isClosing: boolean) {
    if (!child || this.activeChild !== child) {
      return;
    }

    if (isClosing) {
      await this.changeActiveChild(undefined, isClosing);
    } else {
      await child.deactivate(false);
    }
  }

  protected async onDeactivate(isClosing: boolean) {
    await this.deactivateChild(this.activeChild, isClosing);
  }

  protected abstract findNavigationChild(navigationName: string | undefined): Promise<TChild | undefined> | TChild | undefined;

  protected async onChildNavigated(child: TChild | undefined) {
    if (!child && this.activeChild) {
      await this.closeChild(this.activeChild, false);
    }
  }
}
