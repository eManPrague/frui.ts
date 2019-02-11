import AutomaticEntityValidator from "./automaticEntityValidator";
import ManualEntityValidator from "./manualEntityValidator";
import { IEntityValidationRules, IHasManualValidation, IHasValidation } from "./types";

// tslint:disable-next-line: max-line-length
export function attachAutomaticValidator<TTarget>(target: TTarget, entityValidationRules: IEntityValidationRules<TTarget>, errorsImmediatelyVisible: boolean = false) {
  const typedTarget = target as TTarget & IHasValidation<TTarget>;
  typedTarget.__validation = new AutomaticEntityValidator(target, entityValidationRules, errorsImmediatelyVisible);
  return typedTarget;
}

export function attachManualValidator<TTarget>(target: TTarget, errorsImmediatelyVisible: boolean = false) {
  const typedTarget = target as TTarget & IHasManualValidation<TTarget>;
  typedTarget.__validation = new ManualEntityValidator(target, errorsImmediatelyVisible);
  return typedTarget;
}
