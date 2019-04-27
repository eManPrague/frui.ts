import { action, computed, observable } from "mobx";
import { IBusyWatcher } from "../data/types";

export default class BusyWatcher implements IBusyWatcher {
  @observable private counter = 0;

  @computed get isBusy() {
    return this.counter > 0;
  }

  @action.bound public getBusyTicket() {
    this.counter++;

    let wasUsed = false;
    return () => {
      if (!wasUsed) {
        wasUsed = true;
        this.decrement();
      }
    };
  }

  @action.bound public watch(watchedAction: Promise<any>) {
    this.counter++;
    watchedAction.then(this.decrement, this.decrement);
    return watchedAction;
  }

  @action.bound private decrement() {
    this.counter--;
  }
}
