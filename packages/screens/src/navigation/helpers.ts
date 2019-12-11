import { ICanNavigate, IHasNavigationName, IHasNavigationParams } from "./types";

export function hasNavigationName(item: any): item is IHasNavigationName {
  return item.navigationName !== undefined;
}

export function hasNavigationParams(item: any): item is IHasNavigationParams {
  return item.navigationParams !== undefined;
}

export function getNavigationParams(item: any): any {
  return item.navigationParams;
}

export function canApplyNavigationParams(item: any): item is Required<IHasNavigationParams> {
  return item.applyNavigationParams && typeof item.applyNavigationParams === "function";
}

export function canNavigate(item: any): item is ICanNavigate {
  return item.navigate && typeof item.navigate === "function";
}
