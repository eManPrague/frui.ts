import EntityValidator from "./mobxEntityValidator";
import { IHasValidation, IPropertyBoundValidator, IPropertyValidationDescriptor } from "./types";

type IValidator = (propertyValue: any, propertyName: string, entity: any, params: any) => string;
export const validators = new Map<string, IValidator>();

const TrueValidator: IPropertyBoundValidator = _ => null;

type IEntityValidationRules<TTarget> = {
  [K in keyof TTarget]: IValidationRulesSet;
};

interface IGenericEntityValidationRules {
  [key: string]: IValidationRulesSet;
}

interface IValidationRulesSet {
  [ruleName: string]: any;
}

export function attachValidator<TTarget>(
  targetEntity: TTarget,
  entityValidationRules: IEntityValidationRules<TTarget>,
  displayValidationErrors: boolean = false): TTarget & IHasValidation {

  const descriptors = mapValidationDescriptors(entityValidationRules);

  const target = targetEntity as TTarget & IHasValidation;
  target.__validation = new EntityValidator(target, descriptors, displayValidationErrors);
  return target;
}

function mapValidationDescriptors(entityValidationRules: IGenericEntityValidationRules): IPropertyValidationDescriptor[] {
  return Object.keys(entityValidationRules).map(propertyName => ({
    propertyName,
    validator: createValidator(propertyName, (entityValidationRules as IGenericEntityValidationRules)[propertyName]),
  }));
}

export function createValidator(propertyName: string, propertyRules: IValidationRulesSet) {
  let finalValidator: IPropertyBoundValidator;

  for (const ruleName in propertyRules) {
    if (propertyRules.hasOwnProperty(ruleName)) {

      const validator = validators.get(ruleName);
      if (!validator) {
        throw new Error(`Unknown validator ${ruleName}. The validator must be registered in the 'validators' map`);
      }

      const params = propertyRules[ruleName];
      if (finalValidator) {
        const temp = finalValidator;
        finalValidator = (propertyValue, entity) => validator(propertyValue, propertyName, entity, params) || temp(propertyValue, entity);
      } else {
        finalValidator = (propertyValue, entity) => validator(propertyValue, propertyName, entity, params);
      }
    }
  }

  return finalValidator || TrueValidator;
}
