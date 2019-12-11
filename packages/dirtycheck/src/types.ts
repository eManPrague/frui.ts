export type PropertyName<TTarget> = string & keyof TTarget;

/**
 * Contains dirty flags for an entity.
 * Each key is a property name and value is a flag indicating whether the property is dirty
 *
 * Example:
 * ```ts
 * {
 *  firstName: true,
 *  age: false
 * }
 * ```
 */
export type DirtyPropertiesList<TTarget> = Partial<Record<PropertyName<TTarget>, boolean>>;

/** Dirty values watcher attached to an entity reponsible for maintaining dirty flags */
export interface IDirtyWatcher<TTarget> {
  /** Returns `true` when the watched entity has a dirty property, otherwise `false` */
  isDirty: boolean;

  /** Indicates whether existing dirty flags should be displayed to the user */
  isDirtyFlagVisible: boolean;

  /** Dirty flags for the watched entity */
  dirtyProperties: Readonly<DirtyPropertiesList<TTarget>>;

  /** Resets all dirty flags and considers the current entity state as not dirty */
  reset(): void;
}

/** Dirty values watcher with manually maintained dirty flags */
export interface IManualDirtyWatcher<TTarget> extends IDirtyWatcher<TTarget> {
  setDirty(propertyName: PropertyName<TTarget>, isDirty?: boolean): void;
}

/** Represents an entity with attached dirty watcher */
export interface IHasDirtyWatcher<TTarget> {
  __dirtycheck: IDirtyWatcher<TTarget>;
}

/** Represents an entity with attached manual dirty watcher */
export interface IHasManualDirtyWatcher<TTarget> extends IHasDirtyWatcher<TTarget> {
  __dirtycheck: IManualDirtyWatcher<TTarget>;
}
