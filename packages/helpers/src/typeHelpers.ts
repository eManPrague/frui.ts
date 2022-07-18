import { isObservableArray, isObservableMap, isObservableSet } from "mobx";

export function isArrayLike<T = any>(item: any): item is T[] {
  return Array.isArray(item) || isObservableArray(item);
}

export function isSet<T = any>(item: any): item is Set<T> {
  return !!item && (item instanceof Set || isObservableSet(item));
}

export function isMap<K = any, V = any>(item: any): item is Map<K, V> {
  return !!item && (item instanceof Map || isObservableMap(item));
}

export function onlyDefined<T>(input: T | undefined): input is T {
  return !!input;
}
