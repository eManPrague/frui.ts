import { observable } from "mobx";
import * as Validation from "../src";
import validatorsRepository from "../src/validatorsRepository";

class TestEntity {
  @observable firstName: string;
  @observable lastName: string;
}

beforeAll(() => {
  validatorsRepository.set("required", (value, propertyName, entity, params) =>
    !params || value ? undefined : `${propertyName} is required`
  );
  validatorsRepository.set("equals", (value, propertyName, entity, params) =>
    value === params.expectedValue ? undefined : `${propertyName} should be '${params.expectedValue}'`
  );
});

test("attachManualValidator()", () => {
  const entity = new TestEntity();
  Validation.attachManualValidator(entity, false);
  expect(Validation.isValid(entity)).toBeTruthy();
  expect(Validation.isValid(entity, "firstName")).toBeTruthy();

  Validation.addError(entity, "firstName", "First name is required");
  expect(Validation.isValid(entity)).toBeFalsy();
  expect(Validation.isValid(entity, "firstName")).toBeFalsy();
  expect(Validation.isValid(entity, "lastName")).toBeTruthy();
  expect(Validation.getValidationMessage(entity, "firstName")).toBeFalsy();

  expect(Validation.validate(entity)).toBeFalsy();
  expect(Validation.getValidationMessage(entity, "firstName")).toBe("First name is required");

  Validation.addError(entity, "lastName", "Last name is required");
  expect(Validation.isValid(entity)).toBeFalsy();
  expect(Validation.isValid(entity, "lastName")).toBeFalsy();
  expect(Validation.getValidationMessage(entity, "lastName")).toBe("Last name is required");

  Validation.removeError(entity, "firstName");
  expect(Validation.isValid(entity)).toBeFalsy();
  expect(Validation.isValid(entity, "firstName")).toBeTruthy();
  expect(Validation.isValid(entity, "lastName")).toBeFalsy();
  expect(Validation.getValidationMessage(entity, "firstName")).toBeUndefined();

  Validation.clearErrors(entity);
  expect(Validation.isValid(entity)).toBeTruthy();
  expect(Validation.isValid(entity, "firstName")).toBeTruthy();
  expect(Validation.isValid(entity, "lastName")).toBeTruthy();
  expect(Validation.getValidationMessage(entity, "lastName")).toBeUndefined();
});

test("attachAutomaticValidator()", () => {
  const entity = new TestEntity();

  const validationRules = {
    firstName: {
      equals: { expectedValue: "John" },
      required: true,
    },
    lastName: {
      required: false,
    },
  };

  Validation.attachAutomaticValidator(entity, validationRules, false);
  expect(Validation.isValid(entity)).toBeFalsy();
  expect(Validation.isValid(entity, "firstName")).toBeFalsy();
  expect(Validation.isValid(entity, "lastName")).toBeTruthy();
  expect(Validation.getValidationMessage(entity, "firstName")).toBeFalsy();
  expect(Validation.getValidationMessage(entity, "lastName")).toBeFalsy();

  expect(Validation.validate(entity)).toBeFalsy();
  expect(Validation.getValidationMessage(entity, "firstName")).toBe("firstName is required");

  entity.firstName = "Jane";
  expect(Validation.getValidationMessage(entity, "firstName")).toBe("firstName should be 'John'");

  entity.firstName = "John";
  expect(Validation.isValid(entity)).toBeTruthy();
  expect(Validation.isValid(entity, "firstName")).toBeTruthy();
  expect(Validation.getValidationMessage(entity, "firstName")).toBeFalsy();
});
