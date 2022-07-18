import type { PropertyName } from "@frui.ts/helpers";
import { isArrayLike } from "@frui.ts/helpers";
import { computed, makeObservable, observable } from "mobx";
import type { ValidationResponse } from "./automaticValidatorTypes";
import { ValidationLoading } from "./configuration";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { AggregatedValidationResult, EntityValidator, ValidationResult } from "./types";

const emptyResults: never[] = [];
Object.freeze(emptyResults);
export { emptyResults };

export default abstract class EntityValidatorBase<TEntity = unknown> implements EntityValidator<TEntity> {
  @observable
  isEnabled = true;

  @observable
  isVisible = false;

  readonly visibleProperties = observable(new Set<PropertyName<TEntity>>());

  @computed
  get isValid(): AggregatedValidationResult {
    return this.checkValid();
  }

  constructor(isVisible = false) {
    makeObservable(this);
    this.isVisible = isVisible;
  }

  abstract getAllResults(): Iterable<[PropertyName<TEntity>, Iterable<ValidationResult>]>;
  abstract getResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult>;

  *getAllVisibleResults(): Iterable<[PropertyName<TEntity>, Iterable<ValidationResult>]> {
    if (this.isEnabled && (this.isVisible || this.visibleProperties.size)) {
      for (const propertyResult of this.getAllResults()) {
        if (this.isVisible || this.visibleProperties.has(propertyResult[0])) {
          yield propertyResult;
        }
      }
      return this.getAllResults();
    }
  }

  getVisibleResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult> {
    if (this.isEnabled && (this.isVisible || this.visibleProperties.has(propertyName))) {
      return this.getResults(propertyName);
    } else {
      return emptyResults;
    }
  }

  checkValid(): AggregatedValidationResult;
  checkValid(propertyName: PropertyName<TEntity>): AggregatedValidationResult;
  checkValid(propertyName?: PropertyName<TEntity>): AggregatedValidationResult {
    if (propertyName) {
      const results = this.getResults(propertyName);
      return AggregateValidationResults(results);
    } else {
      const results = this.getAllValidationResults();
      return AggregateValidationResults(results);
    }
  }

  checkValidAsync(): Promise<AggregatedValidationResult>;
  checkValidAsync(propertyName: PropertyName<TEntity>): Promise<AggregatedValidationResult>;
  checkValidAsync(propertyName?: PropertyName<TEntity>): Promise<AggregatedValidationResult> {
    // TODO
    if (propertyName) {
      return Promise.resolve(this.checkValid(propertyName));
    } else {
      return Promise.resolve(this.checkValid());
    }
  }

  protected *getAllValidationResults() {
    for (const [, propertyResults] of this.getAllResults()) {
      for (const item of propertyResults) {
        yield item;
      }
    }
  }
}

export function AggregateValidationResults(results: Iterable<ValidationResult>): AggregatedValidationResult {
  let isLoading = false;

  for (const item of results) {
    if (item.isLoading) {
      isLoading = true;
    } else if (!item.isValid) {
      return false;
    }
  }

  return isLoading ? ValidationLoading : true;
}

export function applyMiddleware<T extends ValidationResponse>(
  resultMiddleware: (result: ValidationResult) => ValidationResult,
  result: T
) {
  if (!result) {
    return result;
  } else if (isArrayLike(result)) {
    return result.map(resultMiddleware);
  } else {
    return resultMiddleware(result);
  }
}
