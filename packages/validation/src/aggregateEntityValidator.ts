import type { PropertyName } from "@frui.ts/helpers";
import { observable } from "mobx";
import EntityValidatorBase, { emptyResults } from "./entityValidatorBase";
import type { EntityValidator, ValidationResult } from "./types";

export default class AggregateEntityValidator<TEntity = any> extends EntityValidatorBase<TEntity> {
  public readonly validators: EntityValidator<TEntity>[];

  constructor(...validators: EntityValidator<TEntity>[]) {
    super(true);
    this.validators = observable.array(validators);
  }

  *getAllResults(): Iterable<[PropertyName<TEntity>, Iterable<ValidationResult>]> {
    if (!this.isEnabled) {
      return emptyResults;
    }

    for (const validator of this.validators) {
      if (validator.isEnabled) {
        for (const result of validator.getAllResults()) {
          yield result;
        }
      }
    }
  }

  *getResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult> {
    if (!this.isEnabled) {
      return emptyResults;
    }

    for (const validator of this.validators) {
      if (validator.isEnabled) {
        for (const result of validator.getResults(propertyName)) {
          yield result;
        }
      }
    }
  }

  *getAllVisibleResults(): Iterable<[PropertyName<TEntity>, Iterable<ValidationResult>]> {
    if (!this.isEnabled || !this.isVisible) {
      return emptyResults;
    }

    for (const validator of this.validators) {
      if (validator.isEnabled && validator.isVisible) {
        for (const result of validator.getAllResults()) {
          yield result;
        }
      }
    }
  }

  *getVisibleResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult> {
    if (!this.isEnabled || !this.isVisible) {
      return emptyResults;
    }

    for (const validator of this.validators) {
      if (validator.isEnabled && validator.isVisible) {
        for (const result of validator.getResults(propertyName)) {
          yield result;
        }
      }
    }
  }
}
