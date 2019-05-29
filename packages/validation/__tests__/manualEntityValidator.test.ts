import ManualEntityValidator from "../src/manualEntityValidator";

describe("ManualEntityValidator", () => {
  test("initial state is valid", () => {
    const validator = new ManualEntityValidator({ firstName: "John" }, false);

    expect(validator.errors.firstName).toBeUndefined();
    expect(validator.isValid).toBeTruthy();
  });

  test("adding and removing errors changes valid state", () => {
    const validator = new ManualEntityValidator({ firstName: "John" }, false);

    validator.addError("firstName", "First name is wrong");
    expect(validator.errors.firstName).toBe("First name is wrong");
    expect(validator.isValid).toBeFalsy();

    validator.removeError("firstName");
    expect(validator.errors.firstName).toBeUndefined();
    expect(validator.isValid).toBeTruthy();
  });

  test("clearErrors() removes all validation errors", () => {
    const validator = new ManualEntityValidator({ firstName: "John" }, false);

    validator.addError("firstName", "First name is wrong");
    expect(validator.errors.firstName).toBe("First name is wrong");
    expect(validator.isValid).toBeFalsy();

    validator.clearErrors();
    expect(validator.errors.firstName).toBeUndefined();
    expect(validator.isValid).toBeTruthy();
  });
});
