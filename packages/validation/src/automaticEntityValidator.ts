import type { PropertyName } from "@frui.ts/helpers";
import { get, observable } from "mobx";
import type { EntityValidationRules, ValidationFunction } from "./automaticValidatorTypes";
import DefaultConfiguration from "./configuration";
import EntityValidatorBase, { emptyResults } from "./entityValidatorBase";
import type { ValidationResult } from "./types";
import { attachValidator } from "./utils";

interface AutomaticEntityValidatorConfiguration {
  valueValidators: Map<string, ValidationFunction>;
  resultMiddleware?: (result: ValidationResult) => ValidationResult;
}

export default class AutomaticEntityValidator<TEntity = any> extends EntityValidatorBase<TEntity> {
  private _results: Readonly<Partial<Record<PropertyName<TEntity>, ValidationResult[]>>>;
  private _validatedProperties: PropertyName<TEntity>[] = [];

  constructor(
    target: TEntity,
    validationRules: EntityValidationRules<TEntity>,
    isVisible = false,
    private configuration: AutomaticEntityValidatorConfiguration = DefaultConfiguration
  ) {
    super(isVisible);

    this.buildObservableResults(target, validationRules);
  }

  *getAllResults(): Iterable<[PropertyName<TEntity>, ValidationResult[]]> {
    if (!this.isEnabled) {
      return;
    }

    for (const propertyName of this._validatedProperties) {
      const propertyResults = get(this._results, propertyName) as ValidationResult[] | undefined;
      if (propertyResults?.length) {
        yield [propertyName, propertyResults];
      }
    }
  }

  getResults(propertyName: PropertyName<TEntity>): ValidationResult[] {
    return (this.isEnabled && (get(this._results, propertyName) as ValidationResult[] | undefined)) || emptyResults;
  }

  private buildObservableResults(target: TEntity, entityValidationRules: EntityValidationRules<TEntity>) {
    const errors: Partial<Record<PropertyName<TEntity>, ValidationResult[]>> = {};

    for (const [name, propertyRules] of Object.entries<Record<string, unknown> | undefined>(entityValidationRules)) {
      if (propertyRules) {
        const propertyName = name as PropertyName<TEntity>;
        this._validatedProperties.push(propertyName);

        Object.defineProperty(errors, propertyName, {
          get: buildAggregatedErrorGetter<TEntity>(target, propertyName, propertyRules, this.configuration),
        });
      }
    }

    this._results = observable(errors);
  }
}

export function buildAggregatedErrorGetter<TEntity>(
  entity: TEntity,
  propertyName: PropertyName<TEntity>,
  rules: Record<string, unknown>,
  { valueValidators, resultMiddleware }: AutomaticEntityValidatorConfiguration
): () => ValidationResult[] {
  const validationCalls = Object.entries(rules).map(([validatorName, parameters]) => {
    const validator = valueValidators.get(validatorName) as ValidationFunction<unknown, unknown, TEntity> | undefined;

    if (!validator) {
      throw new Error(
        `Unknown validator '${validatorName}'. The validator must be registered in 'configuration.valueValidators'`
      );
    }

    const validationContext = {
      parameters,
      entity,
      propertyName,
    };

    return (value: unknown) => validator(value, validationContext);
  });

  return () => {
    const value = get(entity, propertyName) as unknown;
    const results = validationCalls.flatMap(x => x(value)).filter((x): x is ValidationResult => !!x); // TODO optimize with Iterable?
    return resultMiddleware ? results.map(resultMiddleware) : results;
  };
}

export function attachAutomaticValidator<TEntity>(
  target: TEntity,
  validationRules: EntityValidationRules<TEntity>,
  isVisible = false
) {
  const automaticValidator = new AutomaticEntityValidator(target, validationRules, isVisible);
  attachValidator(target, automaticValidator);
}
