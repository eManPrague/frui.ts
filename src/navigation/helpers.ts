import { IHasNavigationName } from "./types";

export function hasNavigationName(item: any): item is IHasNavigationName {
  return item.navigationName !== undefined;
}

export function combine(base: string, path: string)  {
  if (base)
  {
    return path ? base + "/" + path : base;
  }
  else
  {
    return path;
  }
}
