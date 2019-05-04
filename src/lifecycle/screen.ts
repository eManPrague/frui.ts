// tslint:disable: max-classes-per-file member-ordering no-identical-functions
import bound from "@src/helpers/bound";
import { computed, observable } from "mobx";
import { IChild, IConductor, IScreen } from "./types";

export default abstract class Screen implements IScreen, IChild<IConductor<Screen>> {
  // TODO view aware

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

type constructor<T> = new (...args: any[]) => T;

// decorator
export function screen<T extends constructor<{}>>(base: T) {
  // TODO can we reuse functions from Screen class?
  return class DecoratedScreen extends base implements IScreen {
    constructor(...args: any[]) {
      super(args);
      this.requestClose = this.requestClose.bind(this);
    }

    private isInitialized = false;
    protected isActiveValue = false;
    get isActive() {
      return this.isActiveValue;
    }

    async activate() {
      if (this.isActive) {
        return;
      }

      await this.initialize();

      if (canActivate(this)) {
        const activateResult = this.onActivate();
        if (activateResult) {
          await activateResult;
        }
      }

      this.isActiveValue = true;
    }

    protected async initialize() {
      if (!this.isInitialized) {
        if (canInitialize(this)) {
          const initializeResult = this.onInitialize();
          if (initializeResult) {
            await initializeResult;
          }
        }

        this.isInitialized = true;
      }
    }

    async deactivate(close: boolean) {
      if (this.isActive || (this.isInitialized && close)) {
        if (canDeactivate(this)) {
          const deactivateResult = this.onDeactivate(close);
          if (deactivateResult) {
            await deactivateResult;
          }
        }

        this.isActiveValue = false;
      }
    }

    requestClose() {
      if (isChild(this)) {
        return this.parent.deactivateItem(this, true);
      }
      else {
        return Promise.resolve();
      }
    }
  };
}

function canInitialize(target: any): target is { onInitialize(): Promise<any> | void } {
  return target.onInitialize && typeof target.onInitialize === "function";
}

function canActivate(target: any): target is { onActivate(): Promise<any> | void } {
  return target.onActivate && typeof target.onActivate === "function";
}

function canDeactivate(target: any): target is { onDeactivate(close: boolean): Promise<any> | void } {
  return target.onDeactivate && typeof target.onDeactivate === "function";
}

function isChild(target: any): target is IChild<IConductor<any>> {
  return target.parent && target.parent.activateItem && typeof target.parent.activateItem === "function";
}
