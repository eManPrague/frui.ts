import { runInAction } from "mobx";
import { Configuration } from ".";
import { AggregatedValidationResult, EntityValidator } from "./types";

export function attachValidator<TEntity>(target: TEntity, validator: EntityValidator<TEntity>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (target as any)[Configuration.validatorAttachedProperty] = validator;
}

export function getValidator<TEntity>(target: TEntity) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (target as any)[Configuration.validatorAttachedProperty] as EntityValidator<TEntity> | undefined;
}

export function checkValid(target: unknown): AggregatedValidationResult {
  const validator = getValidator(target);
  return validator ? validator.checkValid() : true;
}

export function hasVisibleValidationError(target: unknown) {
  const validator = getValidator(target);
  if (validator) {
    for (const [, results] of validator.getAllVisibleResults()) {
      for (const result of results) {
        if (!result.isValid || result.isLoading) {
          return true;
        }
      }
    }
  } else {
    return false;
  }
}

export function validate(target: unknown): boolean {
  const validator = getValidator(target);
  if (validator) {
    if (!validator.isVisible) {
      runInAction(() => (validator.isVisible = true));
    }
    return validator.isValid === true;
  }
  return true;
}
