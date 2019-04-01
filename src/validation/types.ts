export type PropertyName<TTarget> = string & keyof TTarget;

/**
 * Contains validation errors for an entity.
 * Each key is a property name and value is error message for the respective property.
 *
 * Example:
 * ```ts
 * {
 *  firstName: "The value is required",
 *  age: "Age must be a positive number"
 * }
 * ```
 */
export type ValidationErrors<TTarget> = Partial<Record<PropertyName<TTarget>, string>>;

/** Validator attached to an entity reponsible for maintaining validation errors */
export interface IEntityValidator<TTarget> {
  /** Returns `true` when the validated entity has no validation errors, otherwise `false` */
  isValid: boolean;

  /** Indicates whether existing validation errors should be displayed to the user */
  isErrorsVisible: boolean;

  /** Validation errors for the validated entity */
  errors: Readonly<ValidationErrors<TTarget>>;
}

/** Validator with manually maintained validation errors */
export interface IManualEntityValidator<TTarget> extends IEntityValidator<TTarget> {
  addError(propertyName: PropertyName<TTarget>, message: string): void;
  removeError(propertyName: PropertyName<TTarget>): void;
  clearErrors(): void;
}

/**
 * Contains validation definition for the whole entity.
 * Each key represents a single validated property.
 *
 * Example:
 * ```ts
 * {
 *  firstName: {
 *    required: true,
 *    maxLength: 20
 *  },
 *  age: {
 *    range: { min: 0,, max: 99 }
 *  }
 * }
 * ```
 */
export type IEntityValidationRules<TTarget> =
  Partial<Record<PropertyName<TTarget>, IPropertyValidationRules>> & { [propertyName: string]: IPropertyValidationRules };

/**
 * Contains validation rules for a single property.
 * Each key represents a validation rule, with rule-specific params as value.
 *
 * Example:
 * ```ts
 * {
 *  required: true,
 *  range: { min: 0,, max: 99 }
 * }
 * ```
 */
export interface IPropertyValidationRules {
  [ruleName: string]: any;
}

/** Represents an entity with attached entity validator */
export interface IHasValidation<TTarget> {
  __validation: IEntityValidator<TTarget>;
}

/** Represents an entity with attached manual entity validator */
export interface IHasManualValidation<TTarget> extends IHasValidation<TTarget> {
  __validation: IManualEntityValidator<TTarget>;
}
