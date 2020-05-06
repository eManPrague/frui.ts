import { observable, runInAction } from "mobx";

export default class InitializationService {
  @observable isInitialized: boolean;

  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    await Promise.all([
      // @TODO
    ]);

    runInAction(() => (this.isInitialized = true));
  }
}
