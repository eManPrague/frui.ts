import { action, observable } from "mobx";
export default class ManualPromise<T = unknown> {
  promise: Promise<T>;

  @observable status: "new" | "resolved" | "rejected" = "new";

  private resolveCallback: (result: T | PromiseLike<T>) => void;
  private rejectCallback: (reason: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;
    });
  }

  resolve(result: T | PromiseLike<T>): void;
  resolve(): void;

  @action.bound
  resolve(result?: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.resolveCallback(result);
    this.status = "resolved";
  }

  @action.bound
  reject(reason: any) {
    this.rejectCallback(reason);
    this.status = "rejected";
  }
}
