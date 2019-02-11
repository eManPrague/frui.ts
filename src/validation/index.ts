import AutomaticEntityValidator from "./automaticEntityValidator";
import ManualEntityValidator from "./manualEntityValidator";
import { IEntityValidationRules, IHasManualValidation, IHasValidation } from "./types";

/**
 * Attaches a new [[AutomaticEntityValidator]] to the entity and returns the entity typed as [[IHasValidation]]
 * @returns The target entity instance with `IHasValidation` implemented with the attached validator
 */
// tslint:disable-next-line: max-line-length
export function attachAutomaticValidator<TTarget>(target: TTarget, entityValidationRules: IEntityValidationRules<TTarget>, errorsImmediatelyVisible: boolean = false) {
  const typedTarget = target as TTarget & IHasValidation<TTarget>;
  typedTarget.__validation = new AutomaticEntityValidator(target, entityValidationRules, errorsImmediatelyVisible);
  return typedTarget;
}

/**
 * Attaches a new [[ManualEntityValidator]] to the entity and returns the entity typed as [[IHasManualValidation]]
 * @returns The target entity instance with `IHasManualValidation` implemented with the attached validator
 */
export function attachManualValidator<TTarget>(target: TTarget, errorsImmediatelyVisible: boolean = false) {
  const typedTarget = target as TTarget & IHasManualValidation<TTarget>;
  typedTarget.__validation = new ManualEntityValidator(target, errorsImmediatelyVisible);
  return typedTarget;
}
