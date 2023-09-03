import type { IDisposable, PropertyName } from "@frui.ts/helpers";
import { onlyDefined, isArrayLike } from "@frui.ts/helpers";
import { debounce } from "lodash-es";
import type { IReactionDisposer } from "mobx";
import { action, get, observable, reaction } from "mobx";
import type {
  AsyncValidationFunction,
  AsyncValidationFunctionCallback,
  EntityValidationRules,
  ValidationFunction,
  ValidationResponse,
} from "./automaticValidatorTypes";
import DefaultConfiguration from "./configuration";
import EntityValidatorBase, { applyMiddleware, emptyResults } from "./entityValidatorBase";
import type { ValidationResult } from "./types";
import { attachValidator } from "./utils";

interface AsyncEntityValidatorConfiguration {
  valueValidators: Map<string, ValidationFunction>;
  asyncValueValidators: Map<string, AsyncValidationFunction>;
  resultMiddleware?: (result: ValidationResult) => ValidationResult;
}

export default class AsyncEntityValidator<TEntity extends object = any>
  extends EntityValidatorBase<TEntity>
  implements IDisposable
{
  protected readonly validationResults = observable.map<
    PropertyName<TEntity>,
    Map<string, ValidationResult | ValidationResult[]>
  >();
  private readonly disposers: IReactionDisposer[] = [];
  readonly sourceValidationRules: EntityValidationRules<TEntity>;

  constructor(
    target: TEntity,
    validationRules: EntityValidationRules<TEntity>,
    isVisible = false,
    private configuration: AsyncEntityValidatorConfiguration = DefaultConfiguration
  ) {
    super(isVisible);

    this.sourceValidationRules = Object.freeze(validationRules);
    this.buildReactions(target, validationRules);
  }

  dispose() {
    this.disposers.forEach(x => x());
    this.disposers.length = 0;
  }

  private buildReactions(target: TEntity, entityValidationRules: EntityValidationRules<TEntity>) {
    this.disposers.forEach(x => x());
    this.disposers.length = 0;

    for (const [name, propertyRules] of Object.entries<Record<string, unknown> | undefined>(entityValidationRules)) {
      if (propertyRules) {
        const propertyName = name as PropertyName<TEntity>;

        const disposer = this.buildPropertyReaction(target, propertyName, propertyRules);
        if (disposer) {
          this.disposers.push(disposer);
        }
      }
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private buildPropertyReaction(target: TEntity, propertyName: PropertyName<TEntity>, propertyRules: Record<string, unknown>) {
    const propertyResults = observable.map<string, ValidationResult | ValidationResult[]>();
    this.validationResults.set(propertyName, propertyResults);

    const asyncValidationFunctions = this.getAsyncValidationFunctions(propertyRules, target, propertyName, this.configuration);
    const syncValidationFunctions = this.getSyncValidationFunctions(propertyRules, target, propertyName, this.configuration);

    if (!syncValidationFunctions.length && !asyncValidationFunctions.length) {
      return;
    }

    return reaction(
      () => get(target, propertyName) as unknown,
      action(value => {
        for (const [rule, validator] of asyncValidationFunctions) {
          const results = validator(
            value,
            action((validatedValue, asyncResults) => {
              const currentValue = get(target, propertyName) as unknown;
              if (currentValue === validatedValue) {
                if (asyncResults) {
                  propertyResults.set(rule, asyncResults);
                } else {
                  propertyResults.delete(rule);
                }
              }
            })
          );
          if (results) {
            propertyResults.set(rule, results);
          } else {
            propertyResults.delete(rule);
          }
        }

        for (const [rule, validator] of syncValidationFunctions) {
          const results = validator(value);
          if (results) {
            propertyResults.set(rule, results);
          } else {
            propertyResults.delete(rule);
          }
        }
      }),
      { name: "AsyncEntityValidator-" + propertyName, fireImmediately: true }
    );
  }

  private getSyncValidationFunctions(
    rules: Record<string, unknown>,
    entity: TEntity,
    propertyName: PropertyName<TEntity>,
    { valueValidators, resultMiddleware }: AsyncEntityValidatorConfiguration
  ): [validatorName: string, results: (value: unknown) => ValidationResponse][] {
    return Object.entries(rules)
      .map(([validatorName, parameters]) => {
        const validator = valueValidators.get(validatorName) as ValidationFunction<unknown, unknown, TEntity> | undefined;

        if (validator) {
          const validationContext = {
            parameters,
            entity,
            propertyName,
          };

          const validation = resultMiddleware
            ? (value: unknown) => applyMiddleware(resultMiddleware, validator(value, validationContext))
            : (value: unknown) => validator(value, validationContext);

          return [validatorName, validation];
        } else {
          return undefined;
        }
      })
      .filter((x): x is [validatorName: string, results: (value: unknown) => ValidationResponse] => !!x);
  }

  private getAsyncValidationFunctions(
    rules: Record<string, unknown>,
    entity: TEntity,
    propertyName: PropertyName<TEntity>,
    { asyncValueValidators, resultMiddleware }: AsyncEntityValidatorConfiguration
  ) {
    const functions = Object.entries(rules).map(([validatorName, parameters]) => {
      const validator = asyncValueValidators.get(validatorName) as AsyncValidationFunction<unknown, unknown, TEntity> | undefined;

      if (validator) {
        const validationContext = {
          parameters,
          entity,
          propertyName,
        };

        const validation: (value: unknown, callback: AsyncValidationFunctionCallback) => ValidationResponse = resultMiddleware
          ? (value, callback) => {
              const middlewareCallback: AsyncValidationFunctionCallback = (validatedValue, result) =>
                callback(validatedValue, applyMiddleware(resultMiddleware, result));
              const loadingResult = validator(value, validationContext, middlewareCallback);
              return applyMiddleware(resultMiddleware, loadingResult);
            }
          : (value, callback) => validator(value, validationContext, callback);

        const debouncedValidation = debounce(validation, validator.debounceTimeout ?? 500, { leading: true, trailing: true });

        return [validatorName, debouncedValidation] as [
          validatorName: string,
          results: (value: unknown, callback: AsyncValidationFunctionCallback) => ValidationResponse,
        ];
      } else {
        return undefined;
      }
    });

    return functions.filter(onlyDefined);
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  *getAllResults(): Iterable<[PropertyName<TEntity>, Iterable<ValidationResult>]> {
    if (!this.isEnabled) {
      return;
    }

    for (const [propertyName, results] of this.validationResults) {
      if (results.size) {
        yield [propertyName, flatMapValues(results)];
      }
    }
  }

  getResults(propertyName: PropertyName<TEntity>): Iterable<ValidationResult> {
    const results = this.validationResults.get(propertyName);
    if (this.isEnabled && results) {
      return flatMapValues(results);
    }

    return emptyResults;
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function* flatMapValues<T>(map: Map<unknown, T[] | T>): Iterable<T> {
  for (const array of map.values()) {
    if (isArrayLike(array)) {
      for (const item of array) {
        yield item;
      }
    } else {
      yield array;
    }
  }
}

export function attachAsyncValidator<TEntity extends object>(
  target: TEntity,
  validationRules: EntityValidationRules<TEntity>,
  isVisible = false
) {
  const asyncValidator = new AsyncEntityValidator(target, validationRules, isVisible);
  attachValidator(target, asyncValidator);
}
