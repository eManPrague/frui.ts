import type { PropertyName } from "@frui.ts/helpers";

export interface EntityDirtyWatcher<TEntity> {
  isEnabled: boolean;
  isVisible: boolean;
  readonly isDirty: boolean;

  checkDirty(): boolean;
  checkDirty(propertyName: PropertyName<TEntity>): boolean;

  checkDirtyVisible(): boolean;
  checkDirtyVisible(propertyName: PropertyName<TEntity>): boolean;

  getDirtyProperties(): Iterable<PropertyName<TEntity>>;
  getDirtyVisibleProperties(): Iterable<PropertyName<TEntity>>;

  reset(): void;
}
