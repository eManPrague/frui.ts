export default class ManualPromise<T = any> {
  promise: Promise<T>;
  resolve: (result?: T | PromiseLike<T>) => void;
  reject: (reason: any) => void;
  isResolved = false;
  isRejected = false;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = (result: any) => {
        this.isResolved = true;
        resolve(result);
      };

      this.reject = (reason: any) => {
        this.isRejected = true;
        reject(reason);
      };
    });
  }
}
