import { ICanNavigate, INavigationParent } from "./types";

export function isNavigationParent<TChild = any>(item: any): item is INavigationParent<TChild> {
  return item.getChildNavigationPath && typeof item.getChildNavigationPath === "function";
}

export function canNavigate(item: any): item is ICanNavigate {
  return item.navigate && typeof item.navigate === "function";
}
