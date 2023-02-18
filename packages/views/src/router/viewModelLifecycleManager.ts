import type { IViewModel, NavigationContext } from "./types";

export class ViewModelLifecycleManager<
  TParams extends Record<string, string>,
  TSearch,
  TViewModel extends IViewModel<TParams, TSearch>
> {
  #instance: TViewModel | undefined;

  _isInitialized = false;
  #initializationPromise: Promise<void> | undefined;

  _isActive = false;
  #activationPromise: Promise<void> | undefined;

  #navigationPromise: Promise<void> | undefined;

  #deactivationPromise: Promise<void> | undefined;

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

  async initialize(context: NavigationContext<TParams, TSearch>) {
    await (this.#initializationPromise ??= new Promise(
      (resolve, reject) =>
        void this.callInitialize(context)
          .then(resolve, reject)
          .finally(() => (this.#initializationPromise = undefined))
    ));
  }

  private async callInitialize(context: NavigationContext<TParams, TSearch>) {
    if (!this._isInitialized) {
      await this.instance.onInitialize?.(context);
      this._isInitialized = true;
    }
  }

  async activate(context: NavigationContext<TParams, TSearch>) {
    await this.initialize(context);
    await (this.#activationPromise ??= new Promise(
      (resolve, reject) =>
        void this.callActivate(context)
          .then(resolve, reject)
          .finally(() => (this.#activationPromise = undefined))
    ));
  }

  private async callActivate(context: NavigationContext<TParams, TSearch>) {
    if (!this._isActive) {
      await this.instance.onActivate?.(context);
      this._isActive = true;
    }
  }

  async navigate(context: NavigationContext<TParams, TSearch>) {
    await this.activate(context);
    await (this.#navigationPromise ??= new Promise(
      (resolve, reject) =>
        void this.callNavigate(context)
          .then(resolve, reject)
          .finally(() => (this.#navigationPromise = undefined))
    ));
  }

  private async callNavigate(context: NavigationContext<TParams, TSearch>) {
    await this.instance.onNavigate?.(context);
  }

  async deactivate(context: NavigationContext<TParams, TSearch>) {
    await this.#initializationPromise;
    await this.#activationPromise;
    await (this.#deactivationPromise ??= new Promise(
      (resolve, reject) =>
        void this.callDeactivate(context)
          .then(resolve, reject)
          .finally(() => (this.#deactivationPromise = undefined))
    ));
  }

  private async callDeactivate(context: NavigationContext<TParams, TSearch>) {
    if (this._isActive) {
      await this.instance.onDeactivate?.(context);
      this._isActive = false;
    }
  }

  async close(context: NavigationContext<TParams, TSearch>) {
    await this.deactivate(context);
    this.resetInstance();
  }
}
