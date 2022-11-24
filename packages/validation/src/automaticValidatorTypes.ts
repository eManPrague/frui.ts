import type { PropertyName } from "@frui.ts/helpers";
import type { ValidationResult } from "./types";

export interface ValidationFunctionContext<TParameters = unknown, TEntity = any, TProperty = PropertyName<TEntity>> {
  readonly parameters: TParameters;
  readonly entity: TEntity;
  readonly propertyName: TProperty;
}

export type ValidationResponse = ValidationResult | ValidationResult[] | undefined;

export interface ValidationFunction<TValue = unknown, TParameters = any, TEntity = any> {
  (value: TValue, context: ValidationFunctionContext<TParameters, TEntity>): ValidationResponse;
}

export type AsyncValidationFunctionCallback<TValue = unknown> = (validatedValue: TValue, result: ValidationResponse) => void;

export interface AsyncValidationFunction<TValue = unknown, TParameters = any, TEntity = any> {
  (
    value: TValue,
    context: ValidationFunctionContext<TParameters, TEntity>,
    callback: AsyncValidationFunctionCallback<TValue>
  ): ValidationResponse;
  debounceTimeout?: number;
}

export type EntityValidationRules<TEntity, TPropertyRules extends Record<string, unknown> = Record<string, any>> = Partial<
  Record<PropertyName<TEntity>, Partial<TPropertyRules>>
>;
