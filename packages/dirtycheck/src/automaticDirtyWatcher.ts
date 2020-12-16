import { ensureObservableProperty, PropertyName } from "@frui.ts/helpers";
import { action, computed, extendObservable, get, observable } from "mobx";
import { DirtyPropertiesList, IDirtyWatcher } from "./types";

export interface DirtyWatchConfig<TTarget> {
  exclude?: PropertyName<TTarget>[];
}

/** Dirty watcher implementation that automatically observes watched entity's properties and maintains dirty flags */
export default class AutomaticDirtyWatcher<TTarget extends Record<string, any>> implements IDirtyWatcher<TTarget> {
  @observable isDirtyFlagVisible: boolean;
  @observable dirtyProperties: DirtyPropertiesList<TTarget>;
  private checkedProperties: string[];

  constructor(private target: TTarget, isDirtyFlagVisible: boolean, private config?: DirtyWatchConfig<TTarget>) {
    this.isDirtyFlagVisible = isDirtyFlagVisible;
    this.reset();
  }

  @computed get isDirty() {
    return this.checkedProperties.some(prop => !!get(this.dirtyProperties, prop));
  }

  @action
  reset() {
    this.dirtyProperties = {};
    this.checkedProperties = [];

    const target = this.target;

    for (const propertyName in target) {
      if (this.shouldWatchProperty(propertyName)) {
        const originalValue = target[propertyName];

        ensureObservableProperty(target, propertyName, originalValue);
        this.checkedProperties.push(propertyName);

        extendObservable(this.dirtyProperties, {
          get [propertyName]() {
            return get(target, propertyName) !== originalValue;
          },
        });
      }
    }
  }

  private shouldWatchProperty(propertyName: string) {
    if (this.config?.exclude?.includes(propertyName)) {
      return false;
    }

    return true;
  }
}
