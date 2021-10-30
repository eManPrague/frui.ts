import type { PropertyName } from "@frui.ts/helpers";
import type { AsyncValidationResult, ValidationResult } from "./types";

export interface ValidationFunctionContext<TParameters = unknown, TEntity = any, TProperty = PropertyName<TEntity>> {
  readonly parameters: TParameters;
  readonly entity: TEntity;
  readonly propertyName: TProperty;
}

export interface ValidationFunction<TValue = unknown, TParameters = unknown, TEntity = any> {
  (value: TValue, context: ValidationFunctionContext<TParameters, TEntity>): ValidationResult | ValidationResult[] | undefined;
}

export interface AsyncValidationFunction<TValue = unknown, TParameters = unknown, TEntity = any> {
  (value: TValue, context: ValidationFunctionContext<TParameters, TEntity>): Promise<
    AsyncValidationResult | AsyncValidationResult[] | undefined
  >;
}

export type EntityValidationRules<TEntity, TPropertyRules extends Record<string, unknown> = Record<string, unknown>> = Partial<
  Record<PropertyName<TEntity>, Partial<TPropertyRules>>
>;
