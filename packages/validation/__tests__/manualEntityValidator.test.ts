import { autorun } from "mobx";
import { describe, expect, it, test } from "vitest";
import ManualEntityValidator from "../src/manualEntityValidator";
import type { ValidationResult } from "../src/types";
import { expectInvalid, expectValid, testCoreValidatorFunctions } from "./testHelpers";

interface ITarget {
  firstName: string;
}

describe("ManualEntityValidator", () => {
  testCoreValidatorFunctions(
    () => {
      const validator = new ManualEntityValidator<ITarget>();
      validator.setResult("firstName", { code: "required", isValid: true });
      return validator;
    },
    () => {
      const validator = new ManualEntityValidator<ITarget>();
      validator.setResult("firstName", { code: "required", isValid: false });
      return validator;
    },

    () => {
      return new ManualEntityValidator<ITarget>();
    }
  );

  describe("setResult", () => {
    it("calls middleware if present", () => {
      const validator = new ManualEntityValidator<ITarget>(false, {
        resultMiddleware: x => {
          x.message = "Middleware was here";
          return x;
        },
      });

      validator.setResult("firstName", { code: "nameCheck", isValid: true });
      const result = Array.from(validator.getResults("firstName"))[0];

      expect(result).toEqual({ code: "nameCheck", isValid: true, message: "Middleware was here" });
    });
  });

  test("adding and removing errors changes valid state", () => {
    const validator = new ManualEntityValidator<ITarget>(false);

    validator.setResult("firstName", { code: "nameCheck", isValid: true });
    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));

    validator.setResult("firstName", { code: "nameCheck", isValid: false });
    expect(validator.isValid).toBeFalsy();
    expect(validator.checkValid("firstName")).toBeFalsy();
    expectInvalid(validator.getResults("firstName"));

    validator.clearResult("firstName", "nameCheck");
    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  test("clearResults(propertyName) removes validation results for property", () => {
    const validator = new ManualEntityValidator<ITarget>(false);

    validator.setResult("firstName", { code: "nameCheck", isValid: false });
    expect(validator.isValid).toBeFalsy();
    expect(validator.checkValid("firstName")).toBeFalsy();
    expectInvalid(validator.getResults("firstName"));

    validator.clearResults("firstName");
    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  test("clearResults() removes all validation results", () => {
    const validator = new ManualEntityValidator<ITarget>(false);

    validator.setResult("firstName", { code: "nameCheck", isValid: false });
    expect(validator.isValid).toBeFalsy();
    expect(validator.checkValid("firstName")).toBeFalsy();
    expectInvalid(validator.getResults("firstName"));

    validator.clearResults();
    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  test("Reaction works without validator initialization", () => {
    const validator = new ManualEntityValidator<ITarget>(false);

    let lastResults: Iterable<ValidationResult> | undefined = undefined;

    const dispose = autorun(() => (lastResults = validator.getResults("firstName")));
    expectValid(lastResults);

    validator.setResult("firstName", { code: "nameCheck", isValid: false });
    expectInvalid(lastResults);

    validator.setResult("firstName", { code: "nameCheck", isValid: true });
    expectValid(lastResults);

    validator.setResult("firstName", { code: "required", isValid: false });
    expectInvalid(lastResults);

    validator.clearResults();
    expectValid(lastResults);

    dispose();
  });
});
