import type { AsyncValidationFunction, ValidationFunction } from "./automaticValidatorTypes";
import type { ValidationResult } from "./types";

const ValidationLoading = Symbol("Validation loading");

const configuration = {
  validatorAttachedProperty: Symbol("Validation"),
  valueValidators: new Map<string, ValidationFunction>(),
  asyncValueValidators: new Map<string, AsyncValidationFunction>(),
  resultMiddleware: undefined as ((result: ValidationResult) => ValidationResult) | undefined,
};

export default configuration;
export { ValidationLoading };
