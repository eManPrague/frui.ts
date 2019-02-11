export interface IEntityValidator {
  isValid: boolean;
  errorsVisible: boolean;
  errors: { [propertyName: string]: string };
}

export interface IHasValidation {
  __validation: IEntityValidator;
}

export interface IPropertyValidationDescriptor {
  propertyName: string;
  validator: IPropertyBoundValidator;
}

export type IPropertyBoundValidator = (propertyValue: any, entity: any) => string;
