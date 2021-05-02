import { observable } from "mobx";
import AutomaticEntityValidator from "../src/automaticEntityValidator";
import configuration from "../src/configuration";
import { testCoreValidatorFunctions, expectInvalid, expectValid } from "./testHelpers";

beforeAll(() => {
  configuration.valueValidators.set("required", value => ({ code: "required", isValid: !!value }));
  configuration.valueValidators.set("mustBeJohn", value => ({ code: "mustBeJohn", isValid: value === "John" }));
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
    expect(validationErrors?.[0].code).toBe("required");
  });
});
