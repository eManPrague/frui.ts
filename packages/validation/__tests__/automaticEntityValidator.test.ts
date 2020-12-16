import { observable } from "mobx";
import AutomaticEntityValidator, { createPropertyValidatorFromRules } from "../src/automaticEntityValidator";
import validatorsRepository from "../src/validatorsRepository";

beforeAll(() => {
  validatorsRepository.set("required", value => (value ? undefined : "Value is required"));
  validatorsRepository.set("mustBeJohn", (value, propertyName) =>
    value === "John" ? undefined : `${propertyName} must be John`
  );
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

  it("maintains value on empty string", () => {
    const target = observable({
      firstName: "",
    });

    const validationRules = {
      firstName: {
        mustBeJohn: true,
      },
    };

    new AutomaticEntityValidator(target, validationRules, false);
    expect(target.firstName).toBe("");
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
    expect(validator.errors.firstName).toBeUndefined();

    target.firstName = "Peter";

    expect(validator.isValid).toBeFalsy();
    expect(validator.errors.firstName).toBe("firstName must be John");
  });

  it("initializes validation on empty field", () => {
    const target = observable({}) as any;

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
    expect(validator.errors.firstName).toBeUndefined();
  });

  it("initializes validation on a non-observable entity", () => {
    const target = {} as any;

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
    expect(validator.errors.firstName).toBeUndefined();
  });
});

describe("createPropertyValidatorFromRules()", () => {
  test("empty property rules", () => {
    const entity = {
      firstName: "John",
    };

    const validator = createPropertyValidatorFromRules("firstName", {});
    const validationResult = validator(entity.firstName, entity);

    expect(validationResult).toBeUndefined();
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

    expect(validationResult).toBeUndefined();
  });

  test("all validators are called", () => {
    const mockValidator1 = jest.fn(value => undefined);
    validatorsRepository.set("mock1", mockValidator1);

    const mockValidator2 = jest.fn(value => undefined);
    validatorsRepository.set("mock2", mockValidator2);

    const entity = {
      firstName: "John",
    };

    const validator = createPropertyValidatorFromRules("firstName", { mock1: true, mock2: true });
    validator(entity.firstName, entity);

    expect(mockValidator1.mock.calls.length).toBe(1);
    expect(mockValidator2.mock.calls.length).toBe(1);
  });

  test("parameters are passed to validator", () => {
    const mockValidator = jest.fn(value => undefined);
    validatorsRepository.set("mock", mockValidator);

    const entity = {
      firstName: "John",
    };

    const params = { value: "val" };
    const validator = createPropertyValidatorFromRules("firstName", { mock: params });
    validator(entity.firstName, entity);

    const calledParameters = mockValidator.mock.calls[0] as any[];
    expect(calledParameters[0]).toBe("John");
    expect(calledParameters[1]).toBe("firstName");
    expect(calledParameters[2]).toBe(entity);
    expect(calledParameters[3]).toBe(params);
  });
});
