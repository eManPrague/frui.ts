import { action, computed, get, observable, set } from "mobx";
import { DirtyPropertiesList, IManualDirtyWatcher } from "./types";

/** Dirty watcher implementation acting as a simple dirty flags list that needs to be manually maintained */
export default class ManualDirtyWatcher<TTarget> implements IManualDirtyWatcher<TTarget> {
  @observable public isDirtyFlagVisible: boolean;
  @observable public dirtyProperties: DirtyPropertiesList<TTarget> = {};

  constructor(target: TTarget, isDirtyFlagVisible: boolean) {
    this.isDirtyFlagVisible = isDirtyFlagVisible;
  }

  @action
  public setDirty(propertyName: string & keyof TTarget) {
    set(this.dirtyProperties, propertyName, true);
  }

  @action
  public reset() {
    this.dirtyProperties = {};
  }

  @computed get isDirty() {
    return Object.keys(this.dirtyProperties).some(prop => !!get(this.dirtyProperties, prop));
  }
}
