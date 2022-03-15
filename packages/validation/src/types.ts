import type { PropertyName } from "@frui.ts/helpers";
import type { ValidationLoading } from "./configuration";

export interface ValidationResult {
  readonly code: string;
  readonly isValid: boolean;
  readonly isLoading?: boolean;

  message?: string;
  messageParameters?: Record<string, unknown>;
}

export interface AsyncValidationResult extends ValidationResult {
  readonly isLoading: false;
}

export type AggregatedValidationResult = boolean | typeof ValidationLoading;

export type EntityValidationResults<TEntity> = Partial<Record<PropertyName<TEntity>, ValidationResult[]>>;

export interface EntityValidator<TEntity> {
  isEnabled: boolean;
  isVisible: boolean;
  readonly isValid: AggregatedValidationResult;
  readonly visibleProperties: Set<PropertyName<TEntity>>;

  getAllResults(): Iterable<[PropertyName<TEntity>, Iterable<ValidationResult>]>;
  getResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult>;

  getAllVisibleResults(): Iterable<[PropertyName<TEntity>, Iterable<ValidationResult>]>;
  getVisibleResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult>;

  checkValid(): AggregatedValidationResult;
  checkValid(propertyName: PropertyName<TEntity>): AggregatedValidationResult;

  checkValidAsync(): Promise<AggregatedValidationResult>;
  checkValidAsync(propertyName: PropertyName<TEntity>): Promise<AggregatedValidationResult>;
}
