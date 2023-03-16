import { Mutex } from "async-mutex";
import type { IViewModel } from "../types";

export class ViewModelLifecycleManager<TContext, TViewModel extends IViewModel<TContext>> {
  #instance: TViewModel | undefined;
  #lock = new Mutex();

  _isInitialized = false;

  _isActive = false;

  get instance() {
    this.#instance ??= this.factory();
    return this.#instance;
  }

  constructor(private factory: () => TViewModel) {}

  resetInstance() {
    this.#instance = undefined;
    this._isInitialized = false;
    this._isActive = false;
  }

  async initialize(context: TContext) {
    await this.#lock.runExclusive(async () => {
      await this.callInitialize(context);
    });
  }

  private async callInitialize(context: TContext) {
    if (!this._isInitialized) {
      await this.instance.onInitialize?.(context);
      this._isInitialized = true;
    }
  }

  async activate(context: TContext) {
    await this.#lock.runExclusive(async () => {
      await this.callInitialize(context);
      await this.callActivate(context);
    });
  }

  private async callActivate(context: TContext) {
    if (!this._isActive) {
      await this.instance.onActivate?.(context);
      this._isActive = true;
    }
  }

  async navigate(context: TContext) {
    await this.#lock.runExclusive(async () => {
      await this.callInitialize(context);
      await this.callActivate(context);
      await this.callNavigate(context);
    });
  }

  private async callNavigate(context: TContext) {
    await this.instance.onNavigate?.(context);
  }

  async deactivate(context: TContext) {
    await this.#lock.runExclusive(async () => {
      await this.callDeactivate(context);
    });
  }

  private async callDeactivate(context: TContext) {
    if (this._isActive) {
      await this.instance.onDeactivate?.(context);
      this._isActive = false;
    }
  }

  async close(context: TContext) {
    await this.#lock.runExclusive(async () => {
      await this.callDeactivate(context);
      this.resetInstance();
    });
  }
}
