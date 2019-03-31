import AutomaticEntityValidator, { createPropertyValidatorFromRules } from "@src/validation/automaticEntityValidator";
import validatorsRepository from "@src/validation/validatorsRepository";
import { observable } from "mobx";

beforeAll(() => {
  validatorsRepository.set("required", value => !!value ? null : "Value is required");
  validatorsRepository.set("mustBeJohn", (value, propertyName) => value === "John" ? null : `${propertyName} must be John`);
});

describe("AutomaticEntityValidator", () => {
  it("works on empty validations", () => {
    const target = observable({
      firstName: "John",
    });

    const validator = new AutomaticEntityValidator(target, {}, false);

    expect(validator.isValid).toBeTruthy();
    expect(validator.errors.firstName).toBeUndefined();

    target.firstName = "Peter";

    expect(validator.isValid).toBeTruthy();
    expect(validator.errors.firstName).toBeUndefined();
  });

  it("evaluates validation on value change", () => {
    const target = observable({
      firstName: "John",
    });

    const validationRules = {
      firstName: {
        mustBeJohn: true,
      },
    };

    const validator = new AutomaticEntityValidator(target, validationRules, false);

    expect(validator.isValid).toBeTruthy();
    expect(validator.errors.firstName).toBeNull();

    target.firstName = "Peter";

    expect(validator.isValid).toBeFalsy();
    expect(validator.errors.firstName).toBe("firstName must be John");
  });

  it("initializes validation on empty field", () => {
    const target = observable({
    }) as any;

    const validationRules = {
      firstName: {
        mustBeJohn: true,
      },
    };

    const validator = new AutomaticEntityValidator(target, validationRules, false);

    expect(validator.isValid).toBeFalsy();
    expect(validator.errors.firstName).toBe("firstName must be John");

    target.firstName = "John";

    expect(validator.isValid).toBeTruthy();
    expect(validator.errors.firstName).toBeNull();
  });

  it("initializes validation on a non-observable entity", () => {
    const target = {
    } as any;

    const validationRules = {
      firstName: {
        mustBeJohn: true,
      },
    };

    const validator = new AutomaticEntityValidator(target, validationRules, false);

    expect(validator.isValid).toBeFalsy();
    expect(validator.errors.firstName).toBe("firstName must be John");

    target.firstName = "John";

    expect(validator.isValid).toBeTruthy();
    expect(validator.errors.firstName).toBeNull();
  });
});

describe("createPropertyValidatorFromRules()", () => {
  test("empty property rules", () => {
    const entity = {
      firstName: "John",
    };

    const validator = createPropertyValidatorFromRules("firstName", {});
    const validationResult = validator(entity.firstName, entity);

    expect(validationResult).toBeNull();
  });

  test("validation error", () => {
    const entity = {
      firstName: "",
    };

    const validator = createPropertyValidatorFromRules("firstName", { required: true });
    const validationResult = validator(entity.firstName, entity);

    expect(validationResult).toBe("Value is required");
  });

  test("no validation error", () => {
    const entity = {
      firstName: "John",
    };

    const validator = createPropertyValidatorFromRules("firstName", { required: true });
    const validationResult = validator(entity.firstName, entity);

    expect(validationResult).toBeNull();
  });

  test("all validators are called", () => {
    const mockValidator1 = jest.fn(value => null);
    validatorsRepository.set("mock1", mockValidator1);

    const mockValidator2 = jest.fn(value => null);
    validatorsRepository.set("mock2", mockValidator2);

    const entity = {
      firstName: "John",
    };

    const validator = createPropertyValidatorFromRules("firstName", { mock1: true, mock2: true});
    const validationResult = validator(entity.firstName, entity);

    expect(mockValidator1.mock.calls.length).toBe(1);
    expect(mockValidator2.mock.calls.length).toBe(1);
  });

  test("parameters are passed to validator", () => {
    const mockValidator = jest.fn(value => null);
    validatorsRepository.set("mock", mockValidator);

    const entity = {
      firstName: "John",
    };

    const params = { value: "val" };
    const validator = createPropertyValidatorFromRules("firstName", { mock: params});
    const validationResult = validator(entity.firstName, entity);

    const calledParameters = mockValidator.mock.calls[0] as any[];
    expect(calledParameters[0]).toBe("John");
    expect(calledParameters[1]).toBe("firstName");
    expect(calledParameters[2]).toBe(entity);
    expect(calledParameters[3]).toBe(params);
  });
});
