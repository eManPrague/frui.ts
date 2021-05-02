import { PropertyName } from "@frui.ts/helpers";
import { computed, observable } from "mobx";
import { ValidationLoading } from "./configuration";
import { AggregatedValidationResult, EntityValidator, ValidationResult } from "./types";

const emptyResults: never[] = [];
Object.freeze(emptyResults);
export { emptyResults };

export default abstract class EntityValidatorBase<TEntity = unknown> implements EntityValidator<TEntity> {
  @observable
  isEnabled = true;

  @observable
  isVisible = false;

  @computed
  get isValid(): AggregatedValidationResult {
    return this.checkValid();
  }

  constructor(isVisible = false) {
    this.isVisible = isVisible;
  }

  abstract getAllResults(): Iterable<[PropertyName<TEntity>, Iterable<ValidationResult>]>;
  abstract getResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult>;

  getAllVisibleResults(): Iterable<[PropertyName<TEntity>, Iterable<ValidationResult>]> {
    if (this.isEnabled && this.isVisible) {
      return this.getAllResults();
    } else {
      return emptyResults;
    }
  }
  getVisibleResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult> {
    if (this.isEnabled && this.isVisible) {
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
      return results ? AggregateValidationResults(results) : true;
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
