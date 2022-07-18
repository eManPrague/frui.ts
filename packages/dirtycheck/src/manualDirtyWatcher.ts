// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { PropertyName } from "@frui.ts/helpers";
import { action, observable, makeObservable } from "mobx";
import DirtyWatcherBase, { emptyResults } from "./dirtyWatcherBase";

export default class ManualDirtyWatcher<TEntity = any> extends DirtyWatcherBase<TEntity> {
  protected _dirtyProperties = observable.set<PropertyName<TEntity>>();

  constructor(isVisible = true) {
    super(isVisible);

    makeObservable(this);
  }

  checkDirty(): boolean;
  checkDirty(propertyName?: PropertyName<TEntity>): boolean {
    if (!this.isEnabled) {
      return false;
    }

    if (propertyName) {
      return this._dirtyProperties.has(propertyName);
    } else {
      return this._dirtyProperties.size > 0;
    }
  }

  getDirtyProperties(): Iterable<PropertyName<TEntity>> {
    if (this.isEnabled) {
      return this._dirtyProperties;
    } else {
      return emptyResults;
    }
  }

  @action
  setDirty(propertyName: PropertyName<TEntity>, isDirty = true) {
    if (isDirty) {
      this._dirtyProperties.add(propertyName);
    } else {
      this._dirtyProperties.delete(propertyName);
    }
  }

  @action
  reset() {
    this._dirtyProperties.clear();
  }
}
