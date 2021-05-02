import type { ValidationFunction, AsyncValidationFunction } from "./automaticValidatorTypes";

const ValidationLoading = Symbol("Validation loading");

const configuration = {
  validatorAttachedProperty: Symbol("Validation"),
  valueValidators: new Map<string, ValidationFunction>(),
  asyncValueValidators: new Map<string, AsyncValidationFunction>(),
};

export default configuration;
export { ValidationLoading };
