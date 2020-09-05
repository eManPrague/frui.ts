/* eslint-disable @typescript-eslint/tslint/config */
import ManualEntityValidator, { addError, removeError } from "../src/manualEntityValidator";
import { attachManualValidator, validate } from "../src/helpers";

interface ITarget {
  firstName: string;
}

describe("ManualEntityValidator", () => {
  test("initial state is valid", () => {
    const validator = new ManualEntityValidator<ITarget>(false);

    expect(validator.errors.firstName).toBeUndefined();
    expect(validator.isValid).toBeTruthy();
  });

  test("adding and removing errors changes valid state", () => {
    const validator = new ManualEntityValidator<ITarget>(false);

    validator.addError("firstName", "First name is wrong");
    expect(validator.errors.firstName).toBe("First name is wrong");
    expect(validator.isValid).toBeFalsy();

    validator.removeError("firstName");
    expect(validator.errors.firstName).toBeUndefined();
    expect(validator.isValid).toBeTruthy();
  });

  test("clearErrors() removes all validation errors", () => {
    const validator = new ManualEntityValidator<ITarget>(false);

    validator.addError("firstName", "First name is wrong");
    expect(validator.errors.firstName).toBe("First name is wrong");
    expect(validator.isValid).toBeFalsy();

    validator.clearErrors();
    expect(validator.errors.firstName).toBeUndefined();
    expect(validator.isValid).toBeTruthy();
  });

  test("Github Issue #11", () => {
    const target = {
      firstName: "John",
    };

    attachManualValidator(target, false);
    expect(validate(target)).toBeTruthy();

    addError(target, "firstName", "This is not valid");
    expect(validate(target)).toBeFalsy();

    removeError(target, "firstName");
    expect(validate(target)).toBeTruthy();

    addError(target, "firstName", "This is not valid again");
    expect(validate(target)).toBeFalsy();
  });
});
