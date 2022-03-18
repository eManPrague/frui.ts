import { ManualPromise } from "@frui.ts/helpers";
import { observable } from "mobx";
import AsyncEntityValidator from "../src/asyncEntityValidator";
import configuration, { ValidationLoading } from "../src/configuration";
import type { ValidationResult } from "../src/types";
import { expectInvalid, expectValid, testCoreValidatorFunctions } from "./testHelpers";

beforeAll(() => {
  configuration.valueValidators.set("required", value => ({ code: "required", isValid: !!value }));
  configuration.valueValidators.set("mustBeJohn", value => ({ code: "mustBeJohn", isValid: value === "John" }));
  configuration.valueValidators.set("mockValidation", value => undefined);

  configuration.asyncValueValidators.set("asyncCheck", (value, context, callback) => {
    const manualPromise = context.parameters as Promise<boolean>;
    void manualPromise.then(x => callback(value, { code: "asyncCheck", isValid: x }));
    return { code: "asyncCheck", isLoading: true, isValid: false };
  });
});

describe("AsyncEntityValidator", () => {
  testCoreValidatorFunctions(
    () => {
      const target = observable({
        firstName: "John",
      });
      return new AsyncEntityValidator(target, {
        firstName: { required: true },
      });
    },
    () => {
      const target = observable({
        firstName: "",
      });
      return new AsyncEntityValidator(target, {
        firstName: { required: true },
      });
    },

    () => {
      const target = observable({
        firstName: "John",
      });
      return new AsyncEntityValidator(target, {});
    }
  );

  it("works on empty validations", () => {
    const target = observable({
      firstName: "John",
    });

    const validator = new AsyncEntityValidator(target, {}, false);

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

    const validator = new AsyncEntityValidator(
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

    const validator = new AsyncEntityValidator(
      target,
      {
        firstName: { required: true },
      },
      false
    );

    const validationErrors = Array.from(validator.getResults("firstName"));
    expect(validationErrors[0].code).toBe("required");
  });

  it("calls middleware if present", () => {
    const target = observable({
      firstName: "",
    });

    const validator = new AsyncEntityValidator(
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

    const validationErrors = Array.from(validator.getResults("firstName"));
    expect(validationErrors[0].message).toBe("Middleware was here");
  });

  describe("getAllResults", () => {
    it("return only non-empty results", () => {
      const target = observable({
        firstName: "John",
      });

      const validator = new AsyncEntityValidator(
        target,
        {
          firstName: { mockValidation: true },
        },
        false
      );

      const validationErrors = Array.from(validator.getAllResults());
      expect(validationErrors).toHaveLength(0);
    });

    it("returns loading code until validation is resolved", () => {
      const target = observable({
        firstName: "John",
      });

      const manualPromise = new ManualPromise<boolean>();

      const validator = new AsyncEntityValidator(
        target,
        {
          firstName: { asyncCheck: manualPromise.promise },
        },
        false
      );

      const validationErrors = Array.from(validator.getAllResults());
      expect(validationErrors).toHaveLength(1);

      const propertyErrors = Array.from(validationErrors[0][1]);
      expect(propertyErrors).toMatchObject([{ code: "asyncCheck", isLoading: true } as ValidationResult]);

      expect(validator.isValid).toBe(ValidationLoading);

      manualPromise.resolve(true);

      expect(validator.isValid).toBeTruthy();
    });
  });
});
