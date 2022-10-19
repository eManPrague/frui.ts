import { action, computed, makeObservable, ObservableMap } from "mobx";
import { Awaitable } from "./types";

export type BusyWatcherKey = string | symbol;

export interface IBusyWatcher {
  readonly isBusy: boolean;
  checkBusy(key: BusyWatcherKey): boolean;
}

export default class BusyWatcher implements IBusyWatcher {
  protected busyCounter = new ObservableMap<BusyWatcherKey, number>();

  constructor() {
    makeObservable(this);
  }

  @computed get isBusy() {
    return this.busyCounter.size > 0;
  }

  checkBusy(key: BusyWatcherKey) {
    return this.busyCounter.has(key);
  }

  @action.bound
  getBusyTicket(key: BusyWatcherKey = Symbol()) {
    const counter = this.busyCounter.get(key);

    if (counter) {
      this.busyCounter.set(key, counter + 1);
    } else {
      this.busyCounter.set(key, 1);
    }

    let isCleared = false;
    return action(() => {
      if (!isCleared) {
        const currentCounter = this.busyCounter.get(key);
        if (!currentCounter || currentCounter === 1) {
          this.busyCounter.delete(key);
        } else {
          this.busyCounter.set(key, currentCounter - 1);
        }

        isCleared = true;
      }
    });
  }

  watch<T>(watchedAction: Promise<T>) {
    const ticket = this.getBusyTicket();
    watchedAction.then(ticket, ticket);
    return watchedAction;
  }
}

type Decorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

export function watchBusy(key: BusyWatcherKey): Decorator;
export function watchBusy(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;

export function watchBusy(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
  const isCustomKey = typeof target !== "object";
  const key = isCustomKey ? (target as BusyWatcherKey) : Symbol();

  const decorator: Decorator = (_target, _propertyKey, descriptor) => {
    const originalFunction = descriptor.value as (...args: any) => Awaitable<unknown>;

    descriptor.value = function (this: { busyWatcher?: BusyWatcher }, ...args: any[]) {
      const ticket = this.busyWatcher?.getBusyTicket(key);
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
  };

  if (isCustomKey) {
    return decorator;
  } else {
    if (!propertyKey || !descriptor) {
      throw new Error("Wrong decorator use. PropertyKey and Descriptor must be provided");
    }

    return decorator(target, propertyKey, descriptor);
  }
}

function isPromise(value: any): value is Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return typeof value?.then === "function";
}
