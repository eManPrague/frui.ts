// tslint:disable: member-ordering
import { bound } from "@frui.ts/helpers";
import { computed, observable } from "mobx";
import { IHasNavigationName } from "../navigation/types";
import { IChild, IConductor, IScreen } from "./types";

export default abstract class Screen implements IScreen, IChild<IConductor<Screen>>, IHasNavigationName {
  // TODO view aware?
  navigationName: string = this.constructor.name.replace("ViewModel", "");
  name: string;
  parent: IConductor<Screen>;

  private isInitialized = false;
  @observable protected isActiveValue = false;
  @computed get isActive() {
    return this.isActiveValue;
  }

  // this ensures that activateInner will be called only once
  private activatePromise: Promise<void>;
  activate() {
    return this.activatePromise || (this.activatePromise = this.activateInner());
  }

  private async activateInner() {
    if (this.isActiveValue) {
      return;
    }

    await this.initialize();

    const activateResult = this.onActivate();
    if (activateResult) {
      await activateResult;
    }
    this.isActiveValue = true;
    this.activatePromise = null;
  }

  private async initialize() {
    if (!this.isInitialized) {
      const initializeResult = this.onInitialize();
      if (initializeResult) {
        await initializeResult;
      }
      this.isInitialized = true;
    }
  }

  // this ensures that deactivateInner will be called only once
  private deactivatePromise: Promise<void>;
  deactivate(close: boolean) {
    return this.deactivatePromise || (this.deactivatePromise = this.deactivateInner(close));
  }
  private async deactivateInner(close: boolean) {
    if (this.isActiveValue || (this.isInitialized && close)) {
      const deactivateResult = this.onDeactivate(close);
      if (deactivateResult) {
        await deactivateResult;
      }
      this.isActiveValue = false;
    }
    this.deactivatePromise = null;
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
    return this.parent ? this.parent.deactivateItem(this, true) : Promise.resolve();
  }
}
