import { ensureObservableProperty } from "@frui.ts/helpers";
import { computed, extendObservable, get, observable } from "mobx";
import {
  IAutomaticEntityValidation,
  IEntityValidationRules,
  IHasAutomaticValidation,
  IPropertyValidationRules,
  ValidationErrors,
} from "./types";
import validatorsRepository from "./validatorsRepository";

type IPropertyBoundValidator = (propertyValue: any, entity: any) => string | undefined;
const TrueValidator: IPropertyBoundValidator = _ => undefined;

/** Creates actual validator function for a particular property based on the provided validation rules */
export function createPropertyValidatorFromRules(propertyName: string, propertyRules: IPropertyValidationRules) {
  let finalValidator: IPropertyBoundValidator | undefined;

  for (const ruleName in propertyRules) {
    if (propertyRules.hasOwnProperty(ruleName)) {
      const validator = validatorsRepository.get(ruleName);
      if (!validator) {
        throw new Error(`Unknown validator ${ruleName}. The validator must be registered in 'validatorsRepository'`);
      }

      const params = propertyRules[ruleName];
      if (finalValidator) {
        const temp = finalValidator;
        finalValidator = (propertyValue, entity) =>
          validator(propertyValue, propertyName, entity, params) || temp(propertyValue, entity);
      } else {
        finalValidator = (propertyValue, entity) => validator(propertyValue, propertyName, entity, params);
      }
    }
  }

  return finalValidator || TrueValidator;
}

/** Entity validator implementation that automatically observes validated entity's properties and maintains validation errors */
export default class AutomaticEntityValidator<TTarget extends Record<string, any>>
  implements IAutomaticEntityValidation<TTarget> {
  @observable isErrorsVisible: boolean;

  @observable errors: ValidationErrors<TTarget> = {};
  readonly sourceValidationRules: Readonly<IEntityValidationRules<TTarget>>;
  private validatedProperties: string[] = [];

  constructor(target: TTarget, entityValidationRules: IEntityValidationRules<TTarget>, isErrorsVisible: boolean) {
    this.isErrorsVisible = isErrorsVisible;
    this.sourceValidationRules = Object.freeze(entityValidationRules);

    for (const propertyName in entityValidationRules) {
      if (entityValidationRules.hasOwnProperty(propertyName)) {
        const rules = (entityValidationRules as Record<string, IPropertyValidationRules>)[propertyName];

        const validator = createPropertyValidatorFromRules(propertyName, rules);
        if (!validator) {
          continue;
        }

        // TODO just add warning that the target property is not observable
        ensureObservableProperty(target, propertyName, (target as any)[propertyName]);
        this.validatedProperties.push(propertyName);

        extendObservable(this.errors, {
          get [propertyName]() {
            return validator(get(target, propertyName), target);
          },
        });
      }
    }
  }

  @computed get isValid() {
    return this.validatedProperties.every(prop => !get(this.errors, prop));
  }
}

export function hasAutomaticEntityValidator<TTarget>(target: any): target is IHasAutomaticValidation<TTarget> {
  return (
    (target as IHasAutomaticValidation<TTarget>)?.__validation !== undefined &&
    target.__validation.sourceValidationRules !== undefined
  );
}
