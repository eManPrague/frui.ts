import { computed, observable, runInAction } from "mobx";
import type { ClosingNavigationContext, NavigationContext } from "../../models/navigationContext";
import type PathElement from "../../models/pathElements";
import { getNavigator } from "../../screens/screenBase";
import LifecycleScreenNavigatorBase from "../lifecycleScreenNavigatorBase";
import type { LifecycleScreenNavigator, ScreenNavigator } from "../types";

export default class ActiveChildConductor<
  TScreen = unknown,
  TChild = unknown,
  TNavigationParams extends Record<string, string> = Record<string, string>
> extends LifecycleScreenNavigatorBase<TScreen, TNavigationParams> {
  @observable.ref private activeChildValue?: TChild = undefined;

  @computed get activeChild() {
    return this.activeChildValue;
  }

  // extension point, implement this to decide what navigate should do
  canChangeActiveChild?: (context: NavigationContext<TScreen>, currentChild: TChild | undefined) => Promise<boolean>;

  // extension point, implement this to decide what navigate should do
  findNavigationChild?: (
    context: NavigationContext<TScreen>,
    currentChild: TChild | undefined
  ) => Promise<{ newChild: TChild | undefined; closePrevious?: boolean }>;

  // default functionality overrides

  getPrimaryChild(): ScreenNavigator | undefined {
    return getNavigator(this.activeChild);
  }

  async canNavigate(path: PathElement[]) {
    const context: NavigationContext<TScreen> = {
      navigator: this,
      screen: this.screen,
      navigationParams: path[0]?.params,
      path,
    };

    if (this.canChangeActiveChild) {
      const canChange = await this.canChangeActiveChild(context, this.activeChild);
      if (!canChange) {
        return false;
      }
    }

    return await this.aggregateBooleanAll("canNavigate", context);
  }

  async navigate(path: PathElement[]): Promise<void> {
    if (!this.findNavigationChild) {
      throw new Error("findNavigationChild is not implemented");
    }

    const context: NavigationContext<TScreen> = {
      navigator: this,
      screen: this.screen,
      navigationParams: path[0]?.params,
      path,
    };

    if (!this.isInitialized) {
      await this.initialize(context);
    }

    if (!this.isActive) {
      await this.activate(context);
    }

    await this.callAll("onNavigate", context);

    const currentChild = this.activeChild;
    const { newChild, closePrevious } = await this.findNavigationChild(context, currentChild);

    if (currentChild !== newChild) {
      const currentChildNavigator = getNavigator<LifecycleScreenNavigator>(currentChild);
      await currentChildNavigator?.deactivate?.(!!closePrevious);

      runInAction(() => (this.activeChildValue = newChild));
    }

    if (newChild) {
      const newChildNavigator = getNavigator<LifecycleScreenNavigator>(newChild);
      await newChildNavigator?.navigate(path.slice(1));
    }
  }

  async canDeactivate(isClosing: boolean) {
    const context: ClosingNavigationContext<TScreen> = {
      navigator: this,
      screen: this.screen,
      isClosing,
    };

    const canDeactivateFunction = getNavigator<LifecycleScreenNavigator>(this.activeChild)?.canDeactivate;
    if (canDeactivateFunction) {
      const canDeactivate = await canDeactivateFunction(isClosing);
      if (!canDeactivate) {
        return false;
      }
    }

    return this.aggregateBooleanAll("canDeactivate", context);
  }

  async deactivate(isClosing: boolean) {
    const activeChildNavigator = getNavigator<LifecycleScreenNavigator>(this.activeChild);
    await activeChildNavigator?.deactivate?.(isClosing);

    await super.deactivate(isClosing);
  }

  protected connectChild(child: TChild) {
    const navigator = getNavigator(child);
    if (navigator) {
      navigator.parent = this;
    }
  }
}
