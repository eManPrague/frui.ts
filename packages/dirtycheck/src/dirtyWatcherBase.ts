import { computed, observable } from "mobx";
import { PropertyName } from "@frui.ts/helpers";
import { EntityDirtyWatcher } from "./types";

const emptyResults: never[] = [];
Object.freeze(emptyResults);
export { emptyResults };

export default abstract class DirtyWatcherBase<TEntity = unknown> implements EntityDirtyWatcher<TEntity> {
  @observable
  isEnabled = true;

  @observable
  isVisible = false;

  @computed
  get isDirty(): boolean {
    return this.checkDirty();
  }

  constructor(isVisible = true) {
    this.isVisible = isVisible;
  }

  abstract checkDirty(): boolean;
  abstract checkDirty(propertyName: PropertyName<TEntity>): boolean;

  abstract getDirtyProperties(): Iterable<PropertyName<TEntity>>;
  abstract reset(): void;

  checkDirtyVisible(): boolean;
  checkDirtyVisible(propertyName: PropertyName<TEntity>): boolean;
  checkDirtyVisible(propertyName?: any) {
    if (!this.isEnabled || !this.isVisible) {
      return false;
    }

    return this.checkDirty(propertyName);
  }

  getDirtyVisibleProperties(): Iterable<PropertyName<TEntity>> {
    if (this.isEnabled && this.isVisible) {
      return this.getDirtyProperties();
    } else {
      return emptyResults;
    }
  }
}
