import type { PathElement } from "./pathElements";

export type FindChildResult<TChild> = ChildFoundResult<TChild> | NoChildResult;

export interface ChildFoundResult<TChild> {
  newChild: TChild;
  closePrevious?: boolean;

  pathForChild?: PathElement[];
  attachToParent?: boolean;
}

export interface NoChildResult {
  newChild: undefined;
  closePrevious?: boolean;
}

export function isChildFoundResult<T>(result: FindChildResult<T>): result is ChildFoundResult<T> {
  return !!result.newChild;
}
