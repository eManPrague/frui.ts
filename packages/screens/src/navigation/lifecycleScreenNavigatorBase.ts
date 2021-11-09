import { computed, observable, runInAction } from "mobx";
import type { ClosingNavigationContext, NavigationContext } from "../models/navigationContext";
import type PathElement from "../models/pathElements";
import type { HasLifecycleEvents } from "../screens/hasLifecycleHandlers";
import type ScreenBase from "../screens/screenBase";
import type ScreenLifecycleEventHub from "./screenLifecycleEventHub";
import type { LifecycleScreenNavigator, ScreenNavigator } from "./types";

export default abstract class LifecycleScreenNavigatorBase<
  TScreen extends Partial<HasLifecycleEvents> & Partial<ScreenBase>,
  TNavigationParams extends Record<string, string>
> implements LifecycleScreenNavigator
{
  // extension point - you can either set getNavigationName function, or assign navigationName property
  getNavigationName?: () => string;

  private _navigationNameValue?: string;
  get navigationName() {
    return this._navigationNameValue ?? this.getNavigationName?.() ?? this.screen?.constructor.name ?? "unknown";
  }

  set navigationName(value: string) {
    this._navigationNameValue = value || undefined;
  }

  eventHub?: ScreenLifecycleEventHub<TScreen>;
  protected screen?: TScreen;

  parent: ScreenNavigator | undefined = undefined;

  constructor(screen?: TScreen, eventHub?: ScreenLifecycleEventHub<TScreen>) {
    this.screen = screen;
    this.eventHub = eventHub ?? screen?.events;
  }

  canNavigate(path: PathElement[]) {
    const context: NavigationContext<TScreen> = {
      navigator: this,
      screen: this.screen,
      navigationParams: path[0]?.params,
      path,
    };

    return this.aggregateBooleanAll("canNavigate", context);
  }

  getNavigationParams?: () => TNavigationParams;
  getNavigationState(): PathElement {
    return {
      name: this.navigationName,
      params: this.getNavigationParams?.(),
    };
  }

  getPrimaryChild(): ScreenNavigator | undefined {
    return undefined;
  }

  async navigate(path: PathElement[]): Promise<void> {
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
  }

  // initialization
  @observable protected isInitializedValue = false;
  @computed get isInitialized() {
    return this.isInitializedValue;
  }

  protected initialize(context: NavigationContext<TScreen>) {
    return (
      this.initializePromise ??
      (this.initializePromise = this.initializeInner(context).then(this.clearInitializePromise, this.clearInitializePromise))
    );
  }

  private initializePromise?: Promise<void>;
  private clearInitializePromise: () => void = () => (this.initializePromise = undefined);

  private async initializeInner(context: NavigationContext<TScreen>) {
    try {
      await this.callAll("onInitialize", context);
      runInAction(() => (this.isInitializedValue = true));
    } catch (error) {
      console.error("Error while calling onInitialize", error);
    }
  }

  // activation
  @observable protected isActiveValue = false;
  @computed get isActive() {
    return this.isActiveValue;
  }

  protected activate(context: NavigationContext<TScreen>) {
    return (
      this.activatePromise ??
      (this.activatePromise = this.activateInner(context).then(this.clearActivatePromise, this.clearActivatePromise))
    );
  }

  private activatePromise?: Promise<void>;
  private clearActivatePromise: () => void = () => (this.activatePromise = undefined);

  private async activateInner(context: NavigationContext<TScreen>) {
    try {
      await this.callAll("onActivate", context);
      runInAction(() => (this.isActiveValue = true));
    } catch (error) {
      console.error("Error while calling onActivate", error);
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
      await (this.deactivatePromise ??
        (this.deactivatePromise = this.deactivateInner(context).then(this.clearDeactivatePromise, this.clearDeactivatePromise)));
    }
  }

  private deactivatePromise?: Promise<void>;
  private clearDeactivatePromise: () => void = () => (this.deactivatePromise = undefined);

  private async deactivateInner(context: ClosingNavigationContext<TScreen>) {
    try {
      if (this.isActive || context.isClosing) {
        await this.callAll("onDeactivate", context);
        runInAction(() => (this.isActiveValue = false));
      }

      if (context.isClosing && this.isInitialized) {
        await this.callAll("onDispose", context);
      }
    } catch (error) {
      console.error("Error while calling onDeactivate", error);
    }
  }

  // helpers

  protected async aggregateBooleanAll<T extends keyof HasLifecycleEvents>(
    event: T,
    context: Parameters<HasLifecycleEvents[T]>[0]
  ): Promise<boolean> {
    const screenFunction = this.screen?.[event] as (context: NavigationContext<TScreen>) => Promise<boolean> | boolean;
    if (typeof screenFunction === "function") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await screenFunction.call(this.screen, context as any);
      if (result === false) {
        return false;
      }
    }

    const listeners = this.eventHub?.getListeners(event);
    if (listeners) {
      for (const listener of listeners) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
    const screenFunction = this.screen?.[event] as (context: NavigationContext<TScreen>) => Promise<unknown> | void;
    const screenFunctionPromise =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typeof screenFunction === "function" ? screenFunction.call(this.screen, context as any) : undefined;

    const listeners = this.eventHub?.getListeners(event);
    if (listeners?.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await Promise.all([screenFunctionPromise, ...listeners.map(x => x(context as any))]);
    } else {
      await screenFunctionPromise;
    }
  }
}
