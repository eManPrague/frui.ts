# `@frui.ts/validation`

Validation is based on the idea that validation of a particular property of an entity (ie., the result of validation as a list of validation errors) can be handled as a computed value referring to the property and applying validation rules. Validator is thus just a factory that is able to generate such computed properties based on validation rules.

A validator not only maintains validation errors, but also information if the errors should be displayed to the user (the `isErrorsVisible` property). For example, you don't want to display validation errors when creating a new entity until the user clicks Save for the first time. You can set the `isErrorsVisible` property when instantiating / attaching a validator or anytime later. The visibility is also turned on when `validate()` is called for the first time.

## AutomaticEntityValidator

Validator that automatically observes validated entity's properties and maintains validation errors.

The validator uses validation functions defined in `validatorsRepository`.

### Usage

```ts
// create the 'required' validation rule
validatorsRepository.set("required", (value, propertyName, entity, params) => (value == null) ? undefined : `${propertyName} is required.`);
```


```ts
// validation definition for an entity
const validationRules = {
  firstName: {
    required: true // the 'true' value is passed to the validator as 'params'
  }
}
```

```ts
// direct usage
const target = { firstName: "John" };

const validator = new AutomaticEntityValidator(target, validationRules, false);

let isEntityValid = validator.isValid; // true
let firstNameError = validator.errors.firstName; // undefined

target.firstName = "";

isEntityValid = validator.isValid; // false
firstNameError = validator.errors.firstName; // "firstName is required"
```

```ts
// with helpers
import {
  attachAutomaticValidator,
  hasVisibleErrors,
  isValid,
  getValidationMessage,
  validate
} from "@frui.ts/validation";

const target = { firstName: "John" };
attachAutomaticValidator(target);

// you can also use:
// const target = attachAutomaticValidator({ firstName: "John" });

let isEntityValid = isValid(target); // true
let isFirstNameValid = isValid(target, "firstName"); // true
let firstNameError = getValidationMessage(target, "firstName"); // undefined
let errorsVisible = hasVisibleErrors(target); // false

target.firstName = "";

isEntityValid = isValid(target); // false
isFirstNameValid = isValid(target, "firstName"); // false
firstNameError = getValidationMessage(target, "firstName"); // undefined!! - the field is not valid
errorsVisible = hasVisibleErrors(target); // false

isEntityValid = validate(target); // false - sets isErrorsVisible to true and returns isValid value

firstNameError = getValidationMessage(target, "firstName"); // "firstName is required"
errorsVisible = hasVisibleErrors(target); // true
```

## ManualEntityValidator

Basic implementation of `IValidator` interface where you need to manually add validation errors. This is useful when the validation is handled by server.

### Usage

```ts
// direct usage
const target = { firstName: "John" };

const validator = new ManualEntityValidator<typeof target>(false);

let isEntityValid = validator.isValid; // true
let firstNameError = validator.errors.firstName; // undefined

validator.addError("firstName", "First name is wrong");

isEntityValid = validator.isValid; // false
firstNameError = validator.errors.firstName; // "First name is wrong"

validator.clearErrors();
```

```ts
// with helpers
import {
  addError,
  attachManualValidator,
  clearErrors,
  hasVisibleErrors,
  isValid,
  getValidationMessage,
  validate
} from "@frui.ts/validation";

const target = { firstName: "John" };
attachManualValidator(target);

// you can also use:
// const target = attachManualValidator({ firstName: "John" });

let isEntityValid = isValid(target); // true
let isFirstNameValid = isValid(target, "firstName"); // true
let firstNameError = getValidationMessage(target, "firstName"); // undefined
let errorsVisible = hasVisibleErrors(target); // false

addError(target, "firstName", "First name is wrong");

isEntityValid = isValid(target); // false
isFirstNameValid = isValid(target, "firstName"); // false
firstNameError = getValidationMessage(target, "firstName"); // undefined!! - the field is not valid
errorsVisible = hasVisibleErrors(target); // false

isEntityValid = validate(target); // false - sets isErrorsVisible to true and returns isValid value

firstNameError = getValidationMessage(target, "firstName"); // "First name is wrong"
errorsVisible = hasVisibleErrors(target); // true

clearErrors(target);
```

## TODO
 - Composed validator to use client and server side validation
 - Async validators for long validation calls
