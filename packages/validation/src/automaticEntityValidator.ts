import { ensureObservableProperty } from "@frui.ts/helpers";
import { computed, extendObservable, get, observable } from "mobx";
import { IEntityValidationRules, IEntityValidator, IPropertyValidationRules, ValidationErrors } from "./types";
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
export default class AutomaticEntityValidator<TTarget extends Record<string, any>> implements IEntityValidator<TTarget> {
  @observable isErrorsVisible: boolean;

  @observable errors: ValidationErrors<TTarget> = {};
  private validatedProperties: string[] = [];

  constructor(target: TTarget, entityValidationRules: IEntityValidationRules<TTarget>, isErrorsVisible: boolean) {
    this.isErrorsVisible = isErrorsVisible;

    for (const propertyName in entityValidationRules) {
      if (entityValidationRules.hasOwnProperty(propertyName)) {
        const rules = (entityValidationRules as Record<string, IPropertyValidationRules>)[propertyName];

        const validator = createPropertyValidatorFromRules(propertyName, rules);
        if (!validator) {
          continue;
        }

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
