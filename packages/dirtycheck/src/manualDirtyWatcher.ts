import { PropertyName } from "@frui.ts/helpers";
import { action, computed, get, observable, set } from "mobx";
import { DirtyPropertiesList, IHasManualDirtyWatcher, IManualDirtyWatcher } from "./types";

/** Dirty watcher implementation acting as a simple dirty flags list that needs to be manually maintained */
export default class ManualDirtyWatcher<TTarget> implements IManualDirtyWatcher<TTarget> {
  @observable isDirtyFlagVisible: boolean;
  @observable dirtyProperties: DirtyPropertiesList<TTarget> = {};

  constructor(target: TTarget, isDirtyFlagVisible: boolean) {
    this.isDirtyFlagVisible = isDirtyFlagVisible;
  }

  @action
  setDirty(propertyName: PropertyName<TTarget>, isDirty = true): void {
    set(this.dirtyProperties, propertyName, isDirty);
  }

  @action
  reset() {
    this.dirtyProperties = {};
  }

  @computed get isDirty() {
    return Object.keys(this.dirtyProperties).some(prop => !!get(this.dirtyProperties, prop));
  }
}

export function hasManualDirtyWatcher<TTarget>(target: any): target is IHasManualDirtyWatcher<TTarget> {
  return (
    !!target &&
    (target as IHasManualDirtyWatcher<TTarget>).__dirtycheck !== undefined &&
    typeof (target as IHasManualDirtyWatcher<TTarget>).__dirtycheck.setDirty === "function"
  );
}

export function setDirty<TTarget>(target: TTarget, propertyName: PropertyName<TTarget>, isDirty = true) {
  if (hasManualDirtyWatcher<TTarget>(target)) {
    target.__dirtycheck.setDirty(propertyName, isDirty);
  }
}
