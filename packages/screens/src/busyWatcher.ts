import { action, computed, ObservableSet } from "mobx";

export type BusyWatcherKey = string | symbol;

export interface IBusyWatcher {
  readonly isBusy: boolean;
  checkBusy(key: BusyWatcherKey): boolean;
}

export default class BusyWatcher implements IBusyWatcher {
  private busyItems = new ObservableSet<BusyWatcherKey>();

  @computed get isBusy() {
    return this.busyItems.size > 0;
  }

  checkBusy(key: BusyWatcherKey) {
    return this.busyItems.has(key);
  }

  @action.bound
  getBusyTicket(key: BusyWatcherKey = Symbol()) {
    this.busyItems.add(key);
    return action(() => this.busyItems.delete(key));
  }

  watch<T>(watchedAction: Promise<T>) {
    const ticket = this.getBusyTicket();
    watchedAction.then(ticket, ticket);
    return watchedAction;
  }
}

export function watchBusy(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalFunction = descriptor.value as (...args: any) => Promise<unknown> | unknown;

  descriptor.value = function (this: { busyWatcher?: BusyWatcher }, ...args: any[]) {
    const ticket = this.busyWatcher?.getBusyTicket();
    const result = originalFunction.apply(this, args);

    if (ticket) {
      if (isPromise(result)) {
        result.then(ticket, (error: any) => {
          console.error(error);
          ticket();
        });
      } else {
        ticket();
      }
    }

    return result;
  };
}

function isPromise(value: any): value is Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return typeof value?.then === "function";
}
