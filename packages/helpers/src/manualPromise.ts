export default class ManualPromise<T = any> {
  promise: Promise<T>;
  resolve: (result: T | PromiseLike<T>) => void;
  reject: (reason: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
