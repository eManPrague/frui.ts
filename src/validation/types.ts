export type ValidationErrors<TTarget> = { [T in keyof TTarget]?: string };

export interface IEntityValidator<TTarget> {
  isValid: boolean;
  errorsVisible: boolean;
  errors: Readonly<ValidationErrors<TTarget>>;
}

export interface IManualEntityValidator<TTarget> extends IEntityValidator<TTarget> {
  addError(propertyName: string & keyof TTarget, message: string): void;
  removeError(propertyName: string & keyof TTarget): void;
  clearErrors(): void;
}

export type IEntityValidationRules<TTarget> = {
  [K in keyof TTarget]?: IPropertyValidationRules;
};

export interface IPropertyValidationRules {
  [ruleName: string]: any;
}

export interface IHasValidation<TTarget> {
  __validation: IEntityValidator<TTarget>;
}

export interface IHasManualValidation<TTarget> extends IHasValidation<TTarget> {
  __validation: IManualEntityValidator<TTarget>;
}
