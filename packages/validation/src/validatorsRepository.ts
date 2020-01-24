/**
 * Validator function
 *
 * @param propertyValue The actual value that should be validated
 * @param propertyName Name of the validated property. This might be useful for error message.
 * @param entity The whole entity being validated. This might be useful for validations related to other properties.
 * @param params Parameters defined in the validation rule
 *
 * @returns A `string` with validation error message when the validation fails, otherwise `undefined`
 */
export type IValidator = (propertyValue: any, propertyName: string, entity: any, params: any) => string | undefined;

export type IValidatorsRepository<TRuleNames> = Map<TRuleNames, IValidator>;

const validatorsRepository = new Map<string, IValidator>() as IValidatorsRepository<string>;

/**
 * Repository of validators used by [[AutomaticEntityValidator]]
 *
 * You can add a custom validator:
 * ```ts
 * validatorsRepository.set("required", (value, propertyName, entity, params) => (value == null) ? undefined : `${propertyName} is required.`);
 * ```
 * And then use it in validation rules:
 * ```
 * {
 *  firstName: {
 *    required: true // the 'true' value is passed to the validator as 'params'
 *  }
 * }
 * ```
 *
 * @see [[IEntityValidationRules]] [[IPropertyValidationRules]]
 */
export default validatorsRepository;
