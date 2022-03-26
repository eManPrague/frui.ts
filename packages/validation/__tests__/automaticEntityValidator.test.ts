import { observable } from "mobx";
import AutomaticEntityValidator from "../src/automaticEntityValidator";
import configuration from "../src/configuration";
import { expectInvalid, expectValid, testCoreValidatorFunctions } from "./testHelpers";

beforeAll(() => {
  configuration.valueValidators.set("required", value => ({ code: "required", isValid: !!value }));
  configuration.valueValidators.set("mustBeJohn", value => ({ code: "mustBeJohn", isValid: value === "John" }));
  configuration.valueValidators.set("mockValidation", _value => undefined);
});

describe("AutomaticEntityValidator", () => {
  testCoreValidatorFunctions(
    () => {
      const target = observable({
        firstName: "John",
      });
      return new AutomaticEntityValidator(target, {
        firstName: { required: true },
      });
    },
    () => {
      const target = observable({
        firstName: "",
      });
      return new AutomaticEntityValidator(target, {
        firstName: { required: true },
      });
    },

    () => {
      const target = observable({
        firstName: "John",
      });
      return new AutomaticEntityValidator(target, {});
    }
  );

  it("works on empty validations", () => {
    const target = observable({
      firstName: "John",
    });

    const validator = new AutomaticEntityValidator(target, {}, false);

    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));

    target.firstName = "Peter";

    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  it("initializes validations", () => {
    const target = observable({
      firstName: "",
    });

    const validator = new AutomaticEntityValidator(
      target,
      {
        firstName: { required: true },
      },
      false
    );

    expect(validator.isValid).toBeFalsy();
    expect(validator.checkValid("firstName")).toBeFalsy();
    expectInvalid(validator.getResults("firstName"));

    target.firstName = "Peter";

    expect(validator.isValid).toBeTruthy();
    expect(validator.checkValid("firstName")).toBeTruthy();
    expectValid(validator.getResults("firstName"));
  });

  it("returns validation code", () => {
    const target = observable({
      firstName: "",
    });

    const validator = new AutomaticEntityValidator(
      target,
      {
        firstName: { required: true },
      },
      false
    );

    const validationErrors = validator.getResults("firstName");
    expect(validationErrors[0].code).toBe("required");
  });

  it("calls middleware if present", () => {
    const target = observable({
      firstName: "",
    });

    const validator = new AutomaticEntityValidator(
      target,
      {
        firstName: { required: true },
      },
      false,
      {
        ...configuration,
        resultMiddleware: x => {
          x.message = "Middleware was here";
          return x;
        },
      }
    );

    const validationErrors = validator.getResults("firstName");
    expect(validationErrors[0].message).toBe("Middleware was here");
  });

  describe("getAllResults", () => {
    it("return only non-empty results", () => {
      const target = observable({
        firstName: "John",
      });

      const validator = new AutomaticEntityValidator(
        target,
        {
          firstName: { mockValidation: true },
        },
        false
      );

      const validationErrors = Array.from(validator.getAllResults());
      expect(validationErrors).toHaveLength(0);
    });
  });
});
