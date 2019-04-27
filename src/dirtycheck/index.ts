import { PropertyName } from "@src/validation/types";
import AutomaticDirtyWatcher from "./automaticDirtyWatcher";
import ManualDirtyWatcher from "./manualDirtyWatcher";
import { IHasDirtyWatcher, IHasManualDirtyWatcher } from "./types";

/**
 * Attaches a new [[AutomaticDirtyWatcher]] to the entity and returns the entity typed as [[IHasDirtyWatcher]]
 * @returns The target entity instance with `IHasDirtyWatcher` implemented with the attached watcher
 */
export function attachAutomaticDirtyWatcher<TTarget>(target: TTarget, dirtyFlagsImmediatelyVisible = false) {
  const typedTarget = target as TTarget & IHasDirtyWatcher<TTarget>;
  typedTarget.__dirtycheck = new AutomaticDirtyWatcher(target, dirtyFlagsImmediatelyVisible);
  return typedTarget;
}

/**
 * Attaches a new [[ManualDirtyWatcher]] to the entity and returns the entity typed as [[IHasManualDirtyWatcher]]
 * @returns The target entity instance with `IHasManualDirtyWatcher` implemented with the attached watcher
 */
export function attachManualDirtyWatcher<TTarget>(target: TTarget, dirtyFlagsImmediatelyVisible = false) {
  const typedTarget = target as TTarget & IHasManualDirtyWatcher<TTarget>;
  typedTarget.__dirtycheck = new ManualDirtyWatcher(target, dirtyFlagsImmediatelyVisible);
  return typedTarget;
}

export function hasDirtyWatcher<TTarget>(target: any): target is IHasDirtyWatcher<TTarget> {
  return !!target && (target as IHasDirtyWatcher<TTarget>).__dirtycheck !== undefined;
}

export function getDirtyFlag<TTarget>(target: TTarget, propertyName: PropertyName<TTarget>) {
  if (hasDirtyWatcher<TTarget>(target) && target.__dirtycheck.isDirtyFlagVisible) {
    return !!target.__dirtycheck.dirtyProperties[propertyName];
  }
  return null;
}
