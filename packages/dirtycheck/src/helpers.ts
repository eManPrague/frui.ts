import { PropertyName } from "@frui.ts/helpers";
import { get, runInAction } from "mobx";
import AutomaticDirtyWatcher, { DirtyWatchConfig } from "./automaticDirtyWatcher";
import ManualDirtyWatcher from "./manualDirtyWatcher";
import { IHasDirtyWatcher, IHasManualDirtyWatcher } from "./types";

/**
 * Attaches a new [[AutomaticDirtyWatcher]] to the entity and returns the entity typed as [[IHasDirtyWatcher]]
 * @returns The target entity instance with `IHasDirtyWatcher` implemented with the attached watcher
 */
export function attachAutomaticDirtyWatcher<TTarget>(
  target: TTarget,
  dirtyFlagsImmediatelyVisible = false,
  dirtyWatchConfig?: DirtyWatchConfig<TTarget>
) {
  const typedTarget = target as TTarget & IHasDirtyWatcher<TTarget>;
  typedTarget.__dirtycheck = new AutomaticDirtyWatcher(target, dirtyFlagsImmediatelyVisible, dirtyWatchConfig);
  return typedTarget;
}

/**
 * Attaches a new [[ManualDirtyWatcher]] to the entity and returns the entity typed as [[IHasManualDirtyWatcher]]
 * @returns The target entity instance with `IHasManualDirtyWatcher` implemented with the attached watcher
 */
export function attachManualDirtyWatcher<TTarget>(target: TTarget, dirtyFlagsImmediatelyVisible = false) {
  const typedTarget = target as TTarget & IHasManualDirtyWatcher<TTarget>;
  typedTarget.__dirtycheck = new ManualDirtyWatcher<TTarget>(dirtyFlagsImmediatelyVisible);
  return typedTarget;
}

export function hasDirtyWatcher<TTarget>(target: any): target is IHasDirtyWatcher<TTarget> {
  return !!target && (target as IHasDirtyWatcher<TTarget>).__dirtycheck !== undefined;
}

export function isDirty<TTarget>(target: TTarget, propertyName?: PropertyName<TTarget>) {
  if (hasDirtyWatcher<TTarget>(target)) {
    return propertyName ? !!get(target.__dirtycheck.dirtyProperties, propertyName) : target.__dirtycheck.isDirty;
  } else {
    return false;
  }
}

export function hasVisibleDirtyChanges<TTarget>(target: TTarget, propertyName?: PropertyName<TTarget>) {
  if (hasDirtyWatcher<TTarget>(target)) {
    return (
      target.__dirtycheck.isDirtyFlagVisible &&
      (propertyName ? !!get(target.__dirtycheck.dirtyProperties, propertyName) : target.__dirtycheck.isDirty)
    );
  } else {
    return false;
  }
}

export function checkDirtyChanges<TTarget>(target: any) {
  if (hasDirtyWatcher<TTarget>(target)) {
    runInAction(() => (target.__dirtycheck.isDirtyFlagVisible = true));
    return target.__dirtycheck.isDirty;
  } else {
    return false;
  }
}

export function resetDirty<TTarget>(target: TTarget) {
  if (hasDirtyWatcher<TTarget>(target)) {
    target.__dirtycheck.reset();
  }
}
