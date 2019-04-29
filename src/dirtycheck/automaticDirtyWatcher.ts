import { DirtyPropertiesList, IDirtyWatcher } from "@src/dirtycheck/types";
import { ensureObservableProperty } from "@src/helpers/observableHelpers";
import { action, computed, extendObservable, get, observable } from "mobx";

/** Dirty watcher implementation that automatically observes watched entity's properties and maintains dirty flags */
export default class AutomaticDirtyWatcher<TTarget extends {}> implements IDirtyWatcher<TTarget> {
  @observable isDirtyFlagVisible: boolean;
  @observable dirtyProperties: DirtyPropertiesList<TTarget>;
  private checkedProperties: string[];

  constructor(private target: TTarget, isDirtyFlagVisible: boolean) {
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
      if (target.hasOwnProperty(propertyName)) {
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
}
