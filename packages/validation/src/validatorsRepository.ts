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
type IValidator = (propertyValue: any, propertyName: string, entity: any, params: any) => string;

const validatorsRepository = new Map<string, IValidator>();

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
