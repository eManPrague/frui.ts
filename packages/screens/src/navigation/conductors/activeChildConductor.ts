import type { Awaitable } from "@frui.ts/helpers";
import { computed, observable, runInAction } from "mobx";
import type { FindChildResult } from "../../models/findChildResult";
import { isChildFoundResult } from "../../models/findChildResult";
import type { ClosingNavigationContext, NavigationContext } from "../../models/navigationContext";
import type { PathElement } from "../../models/pathElements";
import type ScreenBase from "../../screens/screenBase";
import { getNavigator } from "../../screens/screenBase";
import LifecycleScreenNavigatorBase from "../lifecycleScreenNavigatorBase";
import type { LifecycleScreenNavigator, ScreenNavigator } from "../types";

export type FindNavigationChildHandler<
  TChild = unknown,
  TNavigationParams = unknown,
  TScreen = ScreenBase<ActiveChildConductor<TChild>>,
  TLocation = unknown
> = (
  context: NavigationContext<TNavigationParams, TScreen, TLocation>,
  currentChild: TChild | undefined
) => Awaitable<FindChildResult<TChild>>;

export default class ActiveChildConductor<
  TChild = unknown,
  TNavigationParams extends Record<string, string | undefined> = Record<string, string | undefined>,
  TScreen = any,
  TLocation = unknown
> extends LifecycleScreenNavigatorBase<TNavigationParams, TScreen, TLocation> {
  @observable.ref private activeChildValue?: TChild = undefined;

  @computed get activeChild() {
    return this.activeChildValue;
  }

  // extension point, implement this to decide what navigate should do
  canChangeActiveChild?: (
    context: NavigationContext<TNavigationParams, TScreen, TLocation>,
    currentChild: TChild | undefined
  ) => Awaitable<boolean>;

  // extension point, implement this to decide what navigate should do
  findNavigationChild?: FindNavigationChildHandler<TChild, TNavigationParams, TScreen, TLocation>;

  // default functionality overrides

  getPrimaryChild(): ScreenNavigator | undefined {
    return getNavigator(this.activeChild);
  }

  async canNavigate(path: PathElement[]) {
    const context: NavigationContext<TNavigationParams, TScreen, TLocation> = {
      navigator: this,
      screen: this.screen,
      navigationParams: path[0]?.params as TNavigationParams,
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

  async navigate(path: PathElement[], location?: TLocation): Promise<void> {
    if (!this.findNavigationChild) {
      throw new Error("findNavigationChild is not implemented");
    }

    const context: NavigationContext<TNavigationParams, TScreen, TLocation> = {
      navigator: this,
      screen: this.screen,
      navigationParams: path[0]?.params as TNavigationParams,
      location,
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
    const childResult = await this.findNavigationChild(context, currentChild);

    if (currentChild !== childResult.newChild) {
      const currentChildNavigator = getNavigator<LifecycleScreenNavigator>(currentChild);
      await currentChildNavigator?.deactivate?.(!!childResult.closePrevious);

      if (isChildFoundResult(childResult) && childResult.attachToParent !== false) {
        this.connectChild(childResult.newChild);
      }

      runInAction(() => (this.activeChildValue = childResult.newChild));
    }

    if (isChildFoundResult(childResult)) {
      const newChildNavigator = getNavigator<LifecycleScreenNavigator>(childResult.newChild);
      await newChildNavigator?.navigate(childResult.pathForChild ?? path.slice(this.getNavigationStateLength()));
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

  connectChild(child: TChild) {
    const navigator = getNavigator(child);
    if (navigator) {
      navigator.parent = this;
    }
  }
}
