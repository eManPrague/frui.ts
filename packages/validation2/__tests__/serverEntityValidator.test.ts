import { autorun, observable } from "mobx";
import ServerEntityValidator from "../src/serverEntityValidator";
import { ValidationResult } from "../src/types";
import { expectInvalid, expectValid, testCoreValidatorFunctions } from "./testHelpers";

interface ITarget {
  firstName: string;
}

describe("ServerEntityValidator", () => {
  test("initial state is valid", () => {
    const target = observable({
      firstName: "John",
    });
    const validator = new ServerEntityValidator<ITarget>(target);

    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  test("adding and removing errors changes valid state", () => {
    const target = observable({
      firstName: "John",
    });
    const validator = new ServerEntityValidator<ITarget>(target);

    validator.setResults({ firstName: [{ code: "nameCheck", isValid: true }] });
    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));

    validator.setResults({ firstName: [{ code: "nameCheck", isValid: false }] });
    expect(validator.isValid).toBeFalsy();
    expect(validator.checkValid("firstName")).toBeFalsy();
    expectInvalid(validator.getResults("firstName"));

    validator.setResults({});
    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  test("errors are relevant only with the original property value", () => {
    const target = observable({
      firstName: "John",
    });
    const validator = new ServerEntityValidator<ITarget>(target);

    validator.setResults({ firstName: [{ code: "nameCheck", isValid: false }] });
    expect(validator.isValid).toBeFalsy();
    expect(validator.checkValid("firstName")).toBeFalsy();
    expectInvalid(validator.getResults("firstName"));

    target.firstName = "Bob";
    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  test("clearResults(propertyName) removes validation results for property", () => {
    const target = observable({
      firstName: "John",
    });
    const validator = new ServerEntityValidator<ITarget>(target);
    validator.setResults({ firstName: [{ code: "nameCheck", isValid: false }] });
    expect(validator.isValid).toBeFalsy();
    expect(validator.checkValid("firstName")).toBeFalsy();
    expectInvalid(validator.getResults("firstName"));

    validator.clearResults("firstName");
    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  test("clearResults() removes all validation results", () => {
    const target = observable({
      firstName: "John",
    });
    const validator = new ServerEntityValidator<ITarget>(target);

    validator.setResults({ firstName: [{ code: "nameCheck", isValid: false }] });
    expect(validator.isValid).toBeFalsy();
    expect(validator.checkValid("firstName")).toBeFalsy();
    expectInvalid(validator.getResults("firstName"));

    validator.clearResults();
    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  test("Reaction works without validator initialization", () => {
    const target = observable({
      firstName: "John",
    });
    const validator = new ServerEntityValidator<ITarget>(target);

    let lastResults: ValidationResult[] | undefined = undefined;

    const dispose = autorun(() => (lastResults = validator.getResults("firstName")));
    expectValid(lastResults);

    validator.setResults({ firstName: [{ code: "nameCheck", isValid: false }] });
    expectInvalid(lastResults);

    validator.setResults({ firstName: [{ code: "nameCheck", isValid: true }] });
    expectValid(lastResults);

    validator.setResults({ firstName: [{ code: "nameCheck", isValid: false }] });
    expectInvalid(lastResults);

    validator.clearResults();
    expectValid(lastResults);

    dispose();
  });

  testCoreValidatorFunctions(
    () => {
      const target = observable({
        firstName: "John",
      });
      const validator = new ServerEntityValidator<ITarget>(target);
      validator.setResult("firstName", { code: "required", isValid: true });
      return validator;
    },
    () => {
      const target = observable({
        firstName: "",
      });
      const validator = new ServerEntityValidator<ITarget>(target);
      validator.setResult("firstName", { code: "required", isValid: false });
      return validator;
    },

    () => {
      const target = observable({
        firstName: "John",
      });
      return new ServerEntityValidator<ITarget>(target);
    }
  );
});
