import AutomaticEntityValidator from "./automaticEntityValidator";
import ManualEntityValidator from "./manualEntityValidator";
import { IEntityValidationRules, IHasManualValidation, IHasValidation, PropertyName } from "./types";

/**
 * Attaches a new [[AutomaticEntityValidator]] to the entity and returns the entity typed as [[IHasValidation]]
 * @returns The target entity instance with `IHasValidation` implemented with the attached validator
 */
// tslint:disable-next-line: max-line-length
export function attachAutomaticValidator<TTarget>(target: TTarget, entityValidationRules: IEntityValidationRules<TTarget>, errorsImmediatelyVisible = false) {
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
  typedTarget.__validation = new ManualEntityValidator(target, errorsImmediatelyVisible);
  return typedTarget;
}

export function hasValidation<TTarget>(target: any): target is IHasValidation<TTarget> {
  return (target as IHasValidation<TTarget>).__validation !== undefined;
}

export function getValidationMessage<TTarget>(target: TTarget, propertyName: PropertyName<TTarget>) {
  if (hasValidation<TTarget>(target) && target.__validation.isErrorsVisible) {
    return target.__validation.errors[propertyName];
  }
  return null;
}
