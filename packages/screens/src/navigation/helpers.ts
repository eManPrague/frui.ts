import { ICanNavigate, IHasNavigationName } from "./types";

export function hasNavigationName(item: any): item is IHasNavigationName {
  return item.navigationName !== undefined;
}

export function canNavigate(item: any): item is ICanNavigate {
  return item.navigate && typeof item.navigate === "function";
}
