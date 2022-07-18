// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { PropertyName } from "@frui.ts/helpers";
import { action, observable, makeObservable } from "mobx";
import DefaultConfiguration from "./configuration";
import EntityValidatorBase, { emptyResults } from "./entityValidatorBase";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { ValidationResult } from "./types";

export interface ManualEntityValidatorConfiguration {
  resultMiddleware?: (result: ValidationResult) => ValidationResult;
}

export default class ManualEntityValidator<TEntity = any> extends EntityValidatorBase<TEntity> {
  protected readonly validationResults = observable.map<PropertyName<TEntity>, ValidationResult[]>();

  constructor(isVisible = false, protected configuration: ManualEntityValidatorConfiguration = DefaultConfiguration) {
    super(isVisible);
    makeObservable(this);
  }

  getAllResults(): Iterable<[PropertyName<TEntity>, ValidationResult[]]> {
    return this.isEnabled ? this.validationResults.entries() : emptyResults;
  }

  getResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult> {
    return (this.isEnabled && this.validationResults.get(propertyName)) || emptyResults;
  }

  @action
  setResult(propertyName: PropertyName<TEntity>, result: ValidationResult) {
    const { resultMiddleware } = this.configuration;
    const processedResult = resultMiddleware ? resultMiddleware(result) : result;

    const results = this.validationResults.get(propertyName);
    if (results) {
      const index = results.findIndex(x => x.code === processedResult.code);
      if (index < 0) {
        results.push(processedResult);
      } else {
        results.splice(index, 1, processedResult);
      }
    } else {
      this.validationResults.set(propertyName, observable.array([processedResult]));
    }
  }

  @action
  clearResult(propertyName: PropertyName<TEntity>, resultCode: string) {
    const results = this.validationResults.get(propertyName);
    if (results) {
      const index = results.findIndex(x => x.code === resultCode);
      if (index >= 0) {
        results.splice(index, 1);
      }
    }
  }

  clearResults(): void;
  clearResults(propertyName: PropertyName<TEntity>): void;
  @action
  clearResults(propertyName?: PropertyName<TEntity>) {
    if (propertyName) {
      this.validationResults.delete(propertyName);
    } else {
      this.validationResults.clear();
    }
  }
}
