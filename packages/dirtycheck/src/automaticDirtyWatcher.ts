import type { PropertyName } from "@frui.ts/helpers";
import { isArrayLike, isMap, isSet } from "@frui.ts/helpers";
import { get, observable } from "mobx";
import { getDirtyWatcher } from ".";
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
        } else if (isMap(originalValue)) {
          defineMapDirtyCheckProperty(resultsObject, originalValue, propertyName, entity);
        } else if (typeof originalValue === "object") {
          defineObjectDirtyWatchProperty(resultsObject, originalValue, propertyName, entity);
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
  const hasNestedDirtyWatcher = !!getDirtyWatcher(arraySnapshot[0]);

  if (hasNestedDirtyWatcher) {
    Object.defineProperty(resultsObject, propertyName, {
      get: () => {
        const currentValue = get(entity, propertyName) as unknown[] | undefined;
        return (
          !currentValue ||
          currentValue.length !== arraySnapshot.length ||
          arraySnapshot.some(
            (originalItem, index) => originalItem !== currentValue[index] || getDirtyWatcher(originalItem)?.isDirty === true
          )
        );
      },
    });
  } else {
    Object.defineProperty(resultsObject, propertyName, {
      get: () => {
        const currentValue = get(entity, propertyName) as unknown[] | undefined;
        return (
          !currentValue ||
          currentValue.length !== arraySnapshot.length ||
          arraySnapshot.some((originalItem, index) => originalItem !== currentValue[index])
        );
      },
    });
  }
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
      const currentValue = get(entity, propertyName) as Set<unknown> | undefined;
      if (!currentValue || currentValue.size !== setSnapshot.size) {
        return true;
      }

      for (const item of setSnapshot.values()) {
        if (!currentValue.has(item) || getDirtyWatcher(item)?.isDirty) {
          return true;
        }
      }
      return false;
    },
  });
}

function defineMapDirtyCheckProperty<TEntity>(
  resultsObject: Partial<Record<PropertyName<TEntity>, boolean>>,
  originalValue: Map<unknown, unknown>,
  propertyName: PropertyName<TEntity>,
  entity: TEntity
) {
  const setSnapshot = new Map(originalValue);
  Object.defineProperty(resultsObject, propertyName, {
    get: () => {
      const currentValue = get(entity, propertyName) as Map<unknown, unknown> | undefined;
      if (!currentValue || currentValue.size !== setSnapshot.size) {
        return true;
      }

      for (const [key, item] of setSnapshot.entries()) {
        const currentItem = currentValue.get(key);
        if (item !== currentItem || getDirtyWatcher(item)?.isDirty) {
          return true;
        }
      }
      return false;
    },
  });
}

function defineObjectDirtyWatchProperty<TEntity>(
  resultsObject: Partial<Record<PropertyName<TEntity>, boolean>>,
  originalValue: unknown,
  propertyName: PropertyName<TEntity>,
  entity: TEntity
) {
  const hasNestedDirtyWatcher = getDirtyWatcher(originalValue);
  if (hasNestedDirtyWatcher) {
    Object.defineProperty(resultsObject, propertyName, {
      get: () => getDirtyWatcher(get(entity, propertyName))?.isDirty === true,
    });
  } else {
    Object.defineProperty(resultsObject, propertyName, {
      get: () => {
        const currentValue = get(entity, propertyName) as unknown;
        return originalValue !== currentValue;
      },
    });
  }
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
  const paramsObject: AutomaticDirtyWatcherParams<TEntity> | undefined =
    typeof params === "boolean" ? { isVisible: params } : params;
  const automaticDirtyWatcher = new AutomaticDirtyWatcher(target, paramsObject);
  attachDirtyWatcher(target, automaticDirtyWatcher);
  return automaticDirtyWatcher;
}
