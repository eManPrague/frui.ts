import { extendObservable, isObservable, set } from "mobx";

/**
 * Makes sure the target entity is a Mobx `observable` with observable property
 *
 * @param target Target enetity to make `observable` if needed
 * @param property Name of the property to set
 * @param value Value of the property to set
 */
export function ensureObservableProperty(target: any, property: string, value: any) {
  if (!isObservable(target)) {
    extendObservable(target, {});
  }

  set(target, property, value !== undefined ? value : null);
}
