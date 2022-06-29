// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { PropertyName } from "@frui.ts/helpers";
import { action, get, observable } from "mobx";
import { emptyResults } from "./entityValidatorBase";
import type { ManualEntityValidatorConfiguration } from "./manualEntityValidator";
import ManualEntityValidator from "./manualEntityValidator";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { ValidationResult } from "./types";

export default class ServerEntityValidator<TEntity = any> extends ManualEntityValidator<TEntity> {
  private _validatedValues = observable.map<string, unknown>(undefined, { deep: false });

  constructor(private target: TEntity, configuration?: ManualEntityValidatorConfiguration) {
    super(true, configuration);
  }

  *getAllResults(): Iterable<[PropertyName<TEntity>, ValidationResult[]]> {
    if (!this.isEnabled) {
      return;
    }

    for (const pair of this.validationResults.entries()) {
      // validation errors are relevant only if the current property value is the same as validated
      if (this.isPropertyValueSame(pair[0])) {
        yield pair;
      }
    }
  }

  getResults(propertyName: PropertyName<TEntity>): ValidationResult[] {
    return (this.isEnabled && this.isPropertyValueSame(propertyName) && this.validationResults.get(propertyName)) || emptyResults;
  }

  @action
  setResults(results: Partial<Record<PropertyName<TEntity>, ValidationResult[]>>) {
    this.validationResults.clear();
    this._validatedValues.clear();

    const { resultMiddleware } = this.configuration;

    for (const [name, propertyResults] of Object.entries<ValidationResult[] | undefined>(results)) {
      if (propertyResults) {
        const processedResults = resultMiddleware ? propertyResults.map(resultMiddleware) : propertyResults;

        const propertyName = name as PropertyName<TEntity>;
        this._validatedValues.set(propertyName, get(this.target, propertyName));
        this.validationResults.set(propertyName, observable.array(processedResults));
      }
    }
  }

  @action
  setResult(propertyName: PropertyName<TEntity>, result: ValidationResult) {
    this._validatedValues.set(propertyName, get(this.target, propertyName));
    return super.setResult(propertyName, result);
  }

  private isPropertyValueSame(propertyName: PropertyName<TEntity>) {
    const currentPropertyValue = get(this.target, propertyName) as unknown;
    return currentPropertyValue === this._validatedValues.get(propertyName);
  }
}
