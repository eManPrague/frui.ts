import { createValidator, validators } from "@src/validation";

validators.set("required", value => !!value ? null : "Value is required");

describe("createValidator", () => {
  test("empty property rules", () => {
    const entity = {
      firstName: "John",
    };

    const validator = createValidator("firstName", {});
    const validationResult = validator(entity.firstName, entity);

    expect(validationResult).toBeNull();
  });

  test("validation error", () => {
    const entity = {
      firstName: "",
    };

    const validator = createValidator("firstName", { required: true });
    const validationResult = validator(entity.firstName, entity);

    expect(validationResult).toBe("Value is required");
  });

  test("no validation error", () => {
    const entity = {
      firstName: "John",
    };

    const validator = createValidator("firstName", { required: true });
    const validationResult = validator(entity.firstName, entity);

    expect(validationResult).toBeNull();
  });

  test("all validators are called", () => {
    const mockValidator1 = jest.fn(value => null);
    validators.set("mock1", mockValidator1);

    const mockValidator2 = jest.fn(value => null);
    validators.set("mock2", mockValidator2);

    const entity = {
      firstName: "John",
    };

    const validator = createValidator("firstName", { mock1: true, mock2: true});
    const validationResult = validator(entity.firstName, entity);

    expect(mockValidator1.mock.calls.length).toBe(1);
    expect(mockValidator2.mock.calls.length).toBe(1);
  });

  test("parameters are passed to validator", () => {
    const mockValidator = jest.fn(value => null);
    validators.set("mock", mockValidator);

    const entity = {
      firstName: "John",
    };

    const params = { value: "val" };
    const validator = createValidator("firstName", { mock: params});
    const validationResult = validator(entity.firstName, entity);

    const calledParameters = mockValidator.mock.calls[0];
    expect(calledParameters[0]).toBe("John");
    expect(calledParameters[1]).toBe("firstName");
    expect(calledParameters[2]).toBe(entity);
    expect(calledParameters[3]).toBe(params);
  });
});
