import { PropertyName } from "@frui.ts/helpers";
import { action, observable } from "mobx";
import EntityValidatorBase, { emptyResults } from "./entityValidatorBase";
import { ValidationResult } from "./types";

export default class ManualEntityValidator<TEntity = any> extends EntityValidatorBase<TEntity> {
  protected validationResults = observable.map<PropertyName<TEntity>, ValidationResult[]>();

  getAllResults(): Iterable<[PropertyName<TEntity>, ValidationResult[]]> {
    return (this.isEnabled && this.validationResults.entries()) || emptyResults;
  }

  getResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult> {
    return (this.isEnabled && this.validationResults.get(propertyName)) || emptyResults;
  }

  @action
  setResult(propertyName: PropertyName<TEntity>, result: ValidationResult) {
    const results = this.validationResults.get(propertyName);
    if (results) {
      const index = results.findIndex(x => x.code === result.code);
      if (index < 0) {
        results.push(result);
      } else {
        results.splice(index, 1, result);
      }
    } else {
      this.validationResults.set(propertyName, observable.array([result]));
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
