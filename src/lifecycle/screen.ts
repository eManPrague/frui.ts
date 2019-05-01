// tslint:disable: max-classes-per-file member-ordering no-identical-functions
import { IScreen } from "./types";

export abstract class Screen implements IScreen {
  // TODO view aware
  // TODO ichild?

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
}

type constructor<T> = new (...args: any[]) => T;

// decorator
export function screen<T extends constructor<{}>>(base: T) {
  // TODO can we reuse functions from Screen class?
  return class DecoratedScreen extends base {
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
  };
}

function canInitialize(target: any): target is { onInitialize(): Promise<any> | void } {
  return target.onInitialize && target.onInitialize instanceof Function;
}

function canActivate(target: any): target is { onActivate(): Promise<any> | void } {
  return target.onActivate && target.onActivate instanceof Function;
}

function canDeactivate(target: any): target is { onDeactivate(close: boolean): Promise<any> | void } {
  return target.onDeactivate && target.onDeactivate instanceof Function;
}
