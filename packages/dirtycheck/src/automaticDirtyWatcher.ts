import { isSet, PropertyName } from "@frui.ts/helpers";
import { get, isArrayLike, observable } from "mobx";
import DirtyWatcherBase from "./dirtyWatcherBase";
import { attachDirtyWatcher } from "./utils";

export interface AutomaticDirtyWatcherParams<TEntity> {
  isVisible?: boolean;
  includedProperties?: PropertyName<TEntity>[];
  excludedProperties?: PropertyName<TEntity>[];
}

export default class AutomaticDirtyWatcher<TEntity = any> extends DirtyWatcherBase<TEntity> {
  private _includedProperties?: PropertyName<TEntity>[];
  private _excludedProperties?: PropertyName<TEntity>[];

  private _results: Readonly<Partial<Record<PropertyName<TEntity>, boolean>>>;
  private _watchedProperties: PropertyName<TEntity>[] = [];

  constructor(private target: TEntity, params?: AutomaticDirtyWatcherParams<TEntity>) {
    super(params?.isVisible);

    if (typeof params === "object") {
      this._includedProperties = params.includedProperties;
      this._excludedProperties = params.excludedProperties;
    }

    this.reset();
  }

  checkDirty(): boolean;
  checkDirty(propertyName: PropertyName<TEntity>): boolean;
  checkDirty(propertyName?: any): boolean {
    if (!this.isEnabled) {
      return false;
    }

    if (propertyName) {
      return !!this._results[propertyName as PropertyName<TEntity>];
    } else {
      for (const propertyName of this._watchedProperties) {
        if (this._results[propertyName]) {
          return true;
        }
      }

      return false;
    }
  }

  *getDirtyProperties(): Iterable<PropertyName<TEntity>> {
    if (!this.isEnabled) {
      return;
    }

    for (const propertyName of this._watchedProperties) {
      if (this._results[propertyName]) {
        yield propertyName;
      }
    }
  }

  reset() {
    const resultsObject: Partial<Record<PropertyName<TEntity>, boolean>> = {};
    this._watchedProperties.length = 0;

    for (const name of Object.keys(this.target)) {
      const propertyName = name as PropertyName<TEntity>;
      if (
        (!this._includedProperties || this._includedProperties.includes(propertyName)) &&
        (!this._excludedProperties || !this._excludedProperties.includes(propertyName))
      ) {
        this._watchedProperties.push(propertyName);
        const entity = this.target;

        const originalValue = get(entity, propertyName) as unknown;

        if (isArrayLike(originalValue)) {
          defineArrayDirtyWatchProperty(resultsObject, originalValue, propertyName, entity);
        } else if (isSet(originalValue)) {
          defineSetDirtyCheckProperty(resultsObject, originalValue, propertyName, entity);
        } else {
          Object.defineProperty(resultsObject, propertyName, {
            get: () => {
              const currentValue = get(entity, propertyName) as unknown;
              return originalValue !== currentValue;
            },
          });
        }
      }
    }

    this._results = observable(resultsObject);
  }
}

function defineArrayDirtyWatchProperty<TEntity>(
  resultsObject: Partial<Record<PropertyName<TEntity>, boolean>>,
  originalValue: unknown[],
  propertyName: PropertyName<TEntity>,
  entity: TEntity
) {
  const arraySnapshot = originalValue.slice();
  Object.defineProperty(resultsObject, propertyName, {
    get: () => {
      const currentValue = get(entity, propertyName) as unknown[];
      return (
        !currentValue ||
        currentValue.length !== arraySnapshot.length ||
        arraySnapshot.some((originalItem, index) => originalItem !== currentValue[index])
      );
    },
  });
}

function defineSetDirtyCheckProperty<TEntity>(
  resultsObject: Partial<Record<PropertyName<TEntity>, boolean>>,
  originalValue: Set<unknown>,
  propertyName: PropertyName<TEntity>,
  entity: TEntity
) {
  const setSnapshot = new Set(originalValue);
  Object.defineProperty(resultsObject, propertyName, {
    get: () => {
      const currentValue = get(entity, propertyName) as Set<unknown>;
      if (!currentValue || currentValue.size !== setSnapshot.size) {
        return true;
      }

      for (const item of setSnapshot.values()) {
        if (!currentValue.has(item)) {
          return true;
        }
      }
      return false;
    },
  });
}

export function attachAutomaticDirtyWatcher<TEntity>(target: TEntity): AutomaticDirtyWatcher<TEntity>;
export function attachAutomaticDirtyWatcher<TEntity>(target: TEntity, isVisible: boolean): AutomaticDirtyWatcher<TEntity>;
export function attachAutomaticDirtyWatcher<TEntity>(
  target: TEntity,
  params: AutomaticDirtyWatcherParams<TEntity>
): AutomaticDirtyWatcher<TEntity>;
export function attachAutomaticDirtyWatcher<TEntity>(
  target: TEntity,
  params?: AutomaticDirtyWatcherParams<TEntity> | boolean
): AutomaticDirtyWatcher<TEntity> {
  const automaticDirtyWatcher = new AutomaticDirtyWatcher(target, params as any);
  attachDirtyWatcher(target, automaticDirtyWatcher);
  return automaticDirtyWatcher;
}
