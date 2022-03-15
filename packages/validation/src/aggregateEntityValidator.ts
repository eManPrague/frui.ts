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
      return;
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
      return;
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
    if (!this.isEnabled || (!this.isVisible && !this.visibleProperties.size)) {
      return emptyResults;
    }

    for (const validator of this.validators) {
      for (const result of validator.getAllVisibleResults()) {
        if (this.isVisible || this.visibleProperties.has(result[0])) {
          yield result;
        }
      }
    }
  }

  *getVisibleResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult> {
    if (!this.isEnabled || (!this.isVisible && !this.visibleProperties.has(propertyName))) {
      return emptyResults;
    }

    for (const validator of this.validators) {
      for (const result of validator.getVisibleResults(propertyName)) {
        yield result;
      }
    }
  }
}
