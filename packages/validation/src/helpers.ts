import { PropertyName } from "@frui.ts/helpers";
import { get, runInAction } from "mobx";
import AutomaticEntityValidator from "./automaticEntityValidator";
import ManualEntityValidator from "./manualEntityValidator";
import { IEntityValidationRules, IHasManualValidation, IHasValidation } from "./types";

/**
 * Attaches a new [[AutomaticEntityValidator]] to the entity and returns the entity typed as [[IHasValidation]]
 * @returns The target entity instance with `IHasValidation` implemented with the attached validator
 */
export function attachAutomaticValidator<TTarget>(
  target: TTarget,
  entityValidationRules: IEntityValidationRules<TTarget>,
  errorsImmediatelyVisible = false
) {
  const typedTarget = target as TTarget & IHasValidation<TTarget>;
  typedTarget.__validation = new AutomaticEntityValidator(target, entityValidationRules, errorsImmediatelyVisible);
  return typedTarget;
}

/**
 * Attaches a new [[ManualEntityValidator]] to the entity and returns the entity typed as [[IHasManualValidation]]
 * @returns The target entity instance with `IHasManualValidation` implemented with the attached validator
 */
export function attachManualValidator<TTarget>(target: TTarget, errorsImmediatelyVisible = false) {
  const typedTarget = target as TTarget & IHasManualValidation<TTarget>;
  typedTarget.__validation = new ManualEntityValidator<TTarget>(errorsImmediatelyVisible);
  return typedTarget;
}

export function hasValidation<TTarget>(target: any): target is IHasValidation<TTarget> {
  return (target as IHasValidation<TTarget>)?.__validation !== undefined;
}

export function getValidationMessage<TTarget>(target: TTarget, propertyName: PropertyName<TTarget>): string | undefined {
  if (hasValidation<TTarget>(target) && target.__validation.isErrorsVisible) {
    return get(target.__validation.errors, propertyName) as string | undefined;
  }
  return undefined;
}

export function isValid<TTarget>(target: TTarget, propertyName?: PropertyName<TTarget>) {
  if (hasValidation<TTarget>(target)) {
    return propertyName ? !get(target.__validation.errors, propertyName) : target.__validation.isValid;
  } else {
    return true;
  }
}

export function hasVisibleErrors(target: any) {
  if (hasValidation(target)) {
    return target.__validation.isErrorsVisible && !target.__validation.isValid;
  } else {
    return false;
  }
}

export function hasErrorsVisibilityEnabled(target: any) {
  return hasValidation(target) && target.__validation.isErrorsVisible;
}

export function hideValidationErrors(target: any) {
  if (hasValidation(target) && target.__validation.isErrorsVisible) {
    runInAction(() => (target.__validation.isErrorsVisible = false));
  }
}

export function validate(target: any) {
  if (hasValidation(target)) {
    runInAction(() => (target.__validation.isErrorsVisible = true));
    return target.__validation.isValid;
  } else {
    return true;
  }
}

export function validateAll(items: any[]) {
  return items.reduce((acc: boolean, item) => validate(item) && acc, true);
}
