import * as Validation from "@src/validation";
import validatorsRepository from "@src/validation/validatorsRepository";
import { observable } from "mobx";

class TestEntity {
  @observable firstName: string;
  @observable lastName: string;
}

beforeAll(() => {
  validatorsRepository.set("required", (value, propertyName, entity, params) => 
    (!params || value) ? undefined : `${propertyName} is required.`);
  validatorsRepository.set("equals", (value, propertyName, entity, params) =>
    (value === params.expectedValue) ? undefined : `${propertyName} should be '${params.expectedValue}'.`);
});

test("attachManualValidator()", () => {
  const entity = new TestEntity();
  const typedEntity = Validation.attachManualValidator(entity, false);
  expect(typedEntity.__validation.isValid).toBeTruthy();

  typedEntity.__validation.addError("firstName", "First name is required");
  expect(typedEntity.__validation.isValid).toBeFalsy();
  expect(typedEntity.__validation.errors.firstName).toBe("First name is required");

  typedEntity.__validation.addError("lastName", "Last name is required");
  expect(typedEntity.__validation.isValid).toBeFalsy();
  expect(typedEntity.__validation.errors.lastName).toBe("Last name is required");

  typedEntity.firstName = "John";
  typedEntity.__validation.removeError("firstName");
  expect(typedEntity.__validation.isValid).toBeFalsy();
  expect(typedEntity.__validation.errors.firstName).toBeUndefined();

  typedEntity.lastName = "Doe";
  typedEntity.__validation.clearErrors();
  expect(typedEntity.__validation.isValid).toBeTruthy();
  expect(typedEntity.__validation.errors.lastName).toBeUndefined();
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

  const typedEntity = Validation.attachAutomaticValidator(entity, validationRules, false);
  expect(typedEntity.__validation.isValid).toBeFalsy();
  expect(typedEntity.__validation.errors.firstName).toBeTruthy();
  expect(typedEntity.__validation.errors.lastName).toBeUndefined();

  typedEntity.firstName = "John";
  expect(typedEntity.__validation.isValid).toBeTruthy();
  expect(typedEntity.__validation.errors.firstName).toBeUndefined();
});
