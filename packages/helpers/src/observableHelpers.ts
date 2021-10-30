import { extendObservable, isObservable, set } from "mobx";
import type { BindingTarget } from "./types";

/**
 * Makes sure the target entity is a Mobx `observable` with observable property
 *
 * @param target Target enetity to make `observable` if needed
 * @param property Name of the property to set
 * @param value Value of the property to set
 */
export function ensureObservableProperty<K, V>(target: Map<K, V>, property: K, value: V): void;
export function ensureObservableProperty(target: BindingTarget, property: string, value: any): void;
export function ensureObservableProperty(target: any, property: any, value: any) {
  if (!isObservable(target)) {
    extendObservable(target, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  set(target, property, value);
}
