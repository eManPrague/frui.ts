import { action, observable } from "mobx";
export default class ManualPromise<T = any> {
  promise: Promise<T>;

  @observable status: "new" | "resolved" | "rejected" = "new";

  private resolveCallback: (result?: T | PromiseLike<T>) => void;
  private rejectCallback: (reason: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;
    });
  }

  @action.bound
  resolve(result?: T | PromiseLike<T>) {
    this.resolveCallback(result);
    this.status = "resolved";
  }

  @action.bound
  reject(reason: any) {
    this.rejectCallback(reason);
    this.status = "rejected";
  }
}
