// tslint:disable: member-ordering
import { bound } from "@frui.ts/helpers";
import { computed, observable } from "mobx";
import navigationManager from "../navigation/navigationManager";
import { IHasNavigationName } from "../navigation/types";
import { IChild, IConductor, IScreen } from "./types";

export default abstract class ScreenBase implements IScreen, IChild<IConductor<ScreenBase>>, IHasNavigationName {
  // TODO view aware?
  navigationName: string = this.constructor.name.replace("ViewModel", "");
  name: string;
  parent: IConductor<ScreenBase>;

  protected get canBeNavigationActiveScreen() {
    return true;
  }

  private isInitialized = false;
  @observable protected isActiveValue = false;
  @computed get isActive() {
    return this.isActiveValue;
  }

  // this ensures that activateInner will be called only once even if it takes longer time
  private activatePromise: Promise<void>;
  private clearActivatePromise: () => void = () => (this.activatePromise = undefined);
  activate() {
    return (
      this.activatePromise ||
      (this.activatePromise = this.activateInner().then(this.clearActivatePromise, this.clearActivatePromise))
    );
  }

  private async activateInner() {
    if (this.isActiveValue) {
      return;
    }

    await this.initialize();

    try {
      const activateResult = this.onActivate();
      if (activateResult) {
        await activateResult;
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }

    this.isActiveValue = true;
    this.notifyNavigationChanged();
  }

  private async initialize() {
    if (!this.isInitialized) {
      try {
        const initializeResult = this.onInitialize();
        if (initializeResult) {
          await initializeResult;
        }
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.error(error);
      }

      this.isInitialized = true;
    }
  }

  // this ensures that deactivateInner will be called only once even if it takes a longer time
  private deactivatePromise: Promise<void>;
  private clearDeactivatePromise: () => void = () => (this.deactivatePromise = undefined);
  deactivate(close: boolean) {
    return (
      this.deactivatePromise ||
      (this.deactivatePromise = this.deactivateInner(close).then(
        this.clearDeactivatePromise,
        this.clearDeactivatePromise
      ))
    );
  }
  private async deactivateInner(close: boolean) {
    if (this.isActiveValue || (this.isInitialized && close)) {
      try {
        const deactivateResult = this.onDeactivate(close);
        if (deactivateResult) {
          await deactivateResult;
        }
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.error(error);
      }

      this.isActiveValue = false;
    }
  }

  protected onInitialize(): Promise<any> | void {
    return;
  }

  protected onActivate(): Promise<any> | void {
    return;
  }

  protected onDeactivate(close: boolean): Promise<any> | void {
    return;
  }

  canClose() {
    return Promise.resolve(true);
  }

  @bound requestClose() {
    return this.parent ? this.parent.deactivateChild(this, true) : Promise.resolve();
  }

  protected notifyNavigationChanged() {
    if (this.canBeNavigationActiveScreen && navigationManager.onActiveScreenChanged) {
      navigationManager.onActiveScreenChanged(this);
    }
  }
}
