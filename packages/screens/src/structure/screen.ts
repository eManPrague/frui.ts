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

  async activate() {
    if (this.isActive) {
      return;
    }

    await this.initialize();

    const activateResult = this.onActivate();
    if (activateResult) {
      await activateResult;
    }
    this.isActiveValue = true;
  }

  protected async initialize() {
    if (!this.isInitialized) {
      const initializeResult = this.onInitialize();
      if (initializeResult) {
        await initializeResult;
      }
      this.isInitialized = true;
    }
  }

  async deactivate(close: boolean) {
    if (this.isActive || (this.isInitialized && close)) {
      const deactivateResult = this.onDeactivate(close);
      if (deactivateResult) {
        await deactivateResult;
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
    return this.parent ? this.parent.deactivateItem(this, true) : Promise.resolve();
  }
}
