import { computed, observable, runInAction } from "mobx";
import { ClosingNavigationContext, NavigationContext } from "../navigationContext";
import { HasLifecycleEvents } from "../screens/hasLifecycleHandlers";
import ScreenBase from "../screens/screenBase";
import ScreenLifecycleEventHub from "./screenLifecycleEventHub";
import ScreenNavigator from "./screenNavigator";

export default class ScreenLifecycleNavigator<
  TScreen extends Partial<HasLifecycleEvents> & Partial<ScreenBase>,
  TNavigationParams
> implements ScreenNavigator {
  eventHub?: ScreenLifecycleEventHub<TScreen>;

  constructor(private screen: TScreen, eventHub?: ScreenLifecycleEventHub<TScreen>) {
    this.eventHub = eventHub ?? ((screen as unknown) as ScreenBase).events;
  }

  canNavigate(navigationParams: TNavigationParams) {
    const context: NavigationContext<TScreen> = {
      navigator: this,
      screen: this.screen,
      navigationParams,
    };

    return this.aggregateBooleanAll("canNavigate", context);
  }

  async navigate(navigationParams: TNavigationParams): Promise<void> {
    const context: NavigationContext<TScreen> = {
      navigator: this,
      screen: this.screen,
      navigationParams,
    };

    if (!this.isInitialized) {
      await (this.initializePromise ||
        (this.initializePromise = this.initializeInner(context).then(this.clearInitializePromise, this.clearInitializePromise)));
    }

    if (!this.isActive) {
      await (this.activatePromise ||
        (this.activatePromise = this.activateInner(context).then(this.clearActivatePromise, this.clearActivatePromise)));
    }

    await this.callAll("onNavigate", context);
  }

  // initialization
  @observable protected isInitializedValue = false;
  @computed get isInitialized() {
    return this.isInitializedValue;
  }

  private initializePromise?: Promise<void>;
  private clearInitializePromise: () => void = () => (this.initializePromise = undefined);

  private async initializeInner(context: NavigationContext<TScreen>) {
    try {
      await this.callAll("onInitialize", context);
      runInAction(() => (this.isInitializedValue = true));
    } catch (error) {
      console.error(error);
    }
  }

  // activation
  @observable protected isActiveValue = false;
  @computed get isActive() {
    return this.isActiveValue;
  }

  private activatePromise?: Promise<void>;
  private clearActivatePromise: () => void = () => (this.activatePromise = undefined);

  private async activateInner(context: NavigationContext<TScreen>) {
    try {
      await this.callAll("onActivate", context);
      runInAction(() => (this.isActiveValue = true));
    } catch (error) {
      console.error(error);
    }
  }

  // deactivation
  async canDeactivate(isClosing: boolean) {
    const context: ClosingNavigationContext<TScreen> = {
      navigator: this,
      screen: this.screen,
      isClosing,
    };
    return this.aggregateBooleanAll("canDeactivate", context);
  }

  async deactivate(isClosing: boolean) {
    const context: ClosingNavigationContext<TScreen> = {
      navigator: this,
      screen: this.screen,
      isClosing,
    };

    if (this.isInitialized) {
      await (this.deactivatePromise ||
        (this.deactivatePromise = this.deactivateInner(context).then(this.clearDeactivatePromise, this.clearDeactivatePromise)));
    }
  }

  private deactivatePromise?: Promise<void>;
  private clearDeactivatePromise: () => void = () => (this.deactivatePromise = undefined);

  private async deactivateInner(context: ClosingNavigationContext<TScreen>) {
    try {
      if (this.isActive) {
        await this.callAll("onDeactivate", context);
        runInAction(() => (this.isActiveValue = false));
      }

      if (context.isClosing && this.isInitialized) {
        await this.callAll("onDispose", context);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // helpers

  protected async aggregateBooleanAll<T extends keyof HasLifecycleEvents>(
    event: T,
    context: Parameters<HasLifecycleEvents[T]>[0]
  ): Promise<boolean> {
    const screenFunction = this.screen?.[event];
    if (typeof screenFunction === "function") {
      const result = await screenFunction(context as any);
      if (result === false) {
        return false;
      }
    }

    const listeners = this.eventHub?.getListeners(event);
    if (listeners) {
      for (const listener of listeners) {
        const result = await listener(context as any);
        if (result === false) {
          return false;
        }
      }
    }

    return true;
  }

  protected async callAll<T extends keyof HasLifecycleEvents>(
    event: T,
    context: Parameters<HasLifecycleEvents[T]>[0]
  ): Promise<void> {
    const screenFunction = this.screen?.[event];
    const screenFunctionPromise = typeof screenFunction === "function" ? screenFunction(context as any) : undefined;

    const listeners = this.eventHub?.getListeners(event);
    if (listeners?.length) {
      await Promise.all([screenFunctionPromise, ...listeners]);
    } else {
      await screenFunctionPromise;
    }
  }
}
