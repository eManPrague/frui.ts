import { ICanNavigate, INavigationParent } from "./types";

export function isNavigationParent<TChild = any>(item: any): item is INavigationParent<TChild> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return typeof item?.getChildNavigationPath === "function";
}

export function canNavigate(item: any): item is ICanNavigate {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return typeof item?.navigate === "function";
}
