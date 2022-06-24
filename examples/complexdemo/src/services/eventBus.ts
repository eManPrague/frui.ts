import type { IDisposable } from "@frui.ts/helpers";
import { EventBus as TsBus } from "ts-bus";
import type { PredicateFn } from "ts-bus/EventBus";
import type { BusEvent, EventCreatorFn } from "ts-bus/types";

export interface IEventBus {
  subscribe(subscription: string, handler: (e: BusEvent) => void): IDisposable;
  subscribe<T extends BusEvent>(
    subscription: EventCreatorFn<T>,
    handler: (e: ReturnType<typeof subscription>) => void
  ): IDisposable;
  subscribe<T extends BusEvent>(subscription: PredicateFn<T>, handler: (e: T) => void): IDisposable;

  subscribeAll(handler: (e: BusEvent) => void): IDisposable;

  publish<TPayload>(eventName: string, payload: TPayload): void;
  publish<T extends BusEvent>(event: T, meta?: any): void;
}

/** Check ts-bus documentation for detailed information (https://github.com/ryardley/ts-bus) */
export default class EventBus implements IEventBus {
  private bus = new TsBus();

  subscribe(subscription: string, handler: (e: BusEvent) => void): IDisposable;
  subscribe<T extends BusEvent>(
    subscription: EventCreatorFn<T>,
    handler: (e: ReturnType<typeof subscription>) => void
  ): IDisposable;
  subscribe<T extends BusEvent>(subscription: PredicateFn<T>, handler: (e: T) => void): IDisposable;
  subscribe<T extends BusEvent>(
    subscription: string | EventCreatorFn<T> | PredicateFn<T>,
    handler: (e: any) => void
  ): IDisposable {
    const unsubscribe = this.bus.subscribe(subscription, handler);
    return { dispose: unsubscribe };
  }

  subscribeAll(handler: (e: BusEvent) => void) {
    return this.subscribe("**", handler);
  }

  publish<TPayload>(eventName: string, payload: TPayload): void;
  publish<T extends BusEvent>(event: T, meta?: any): void;
  publish(event: string | BusEvent, payloadOrMeta?: unknown) {
    if (typeof event === "string") {
      this.bus.publish({
        type: event,
        payload: payloadOrMeta,
      });
    } else {
      this.bus.publish(event, payloadOrMeta);
    }
  }
}
