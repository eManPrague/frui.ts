import { PropertyName } from "@frui.ts/helpers";
import { action, computed, observable, remove, set, values, keys } from "mobx";
import { IHasManualValidation, IManualEntityValidator, ValidationErrors } from "./types";

/** Entity validator implementation acting as a simple validation errors list that needs to be manually maintained */
export default class ManualEntityValidator<TTarget> implements IManualEntityValidator<TTarget> {
  @observable isErrorsVisible: boolean;
  @observable errors: ValidationErrors<TTarget> = {};
  @observable readonly requiredProperties = [];

  constructor(isErrorsVisible: boolean) {
    this.isErrorsVisible = isErrorsVisible;
  }

  @action
  clearErrors() {
    keys(this.errors).forEach(prop => remove(this.errors, prop));
  }

  @action
  addError(propertyName: PropertyName<TTarget>, message: string) {
    set(this.errors, propertyName, message);
  }

  @action
  removeError(propertyName: PropertyName<TTarget>) {
    remove(this.errors, propertyName);
  }

  @computed get isValid() {
    return values(this.errors).every(x => !x);
  }
}

export function hasManualEntityValidator<TTarget>(target: any): target is IHasManualValidation<TTarget> {
  return (
    !!target &&
    (target as IHasManualValidation<TTarget>).__validation !== undefined &&
    typeof (target as IHasManualValidation<TTarget>).__validation.addError === "function"
  );
}

export function clearErrors<TTarget>(target: TTarget) {
  if (hasManualEntityValidator<TTarget>(target)) {
    target.__validation.clearErrors();
  }
}

export function addError<TTarget>(target: TTarget, propertyName: PropertyName<TTarget>, message: string) {
  if (hasManualEntityValidator<TTarget>(target)) {
    target.__validation.addError(propertyName, message);
  }
}

export function removeError<TTarget>(target: TTarget, propertyName: PropertyName<TTarget>) {
  if (hasManualEntityValidator<TTarget>(target)) {
    target.__validation.removeError(propertyName);
  }
}
