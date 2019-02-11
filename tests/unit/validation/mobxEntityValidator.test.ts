import MobxEntityValidator from "@src/validation/mobxEntityValidator";
import { IPropertyValidationDescriptor } from "@src/validation/types";
import { observable } from "mobx";

describe("mobxEntityValidator", () => {
  it("works on empty validations", () => {
    const target = observable({
      firstName: "John",
    });

    const validations: IPropertyValidationDescriptor[] = [];

    const validator = new MobxEntityValidator(target, validations, false);

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

    const validations: IPropertyValidationDescriptor[] = [
      {
        propertyName: "firstName",
        validator: (value, entity) => value === "John" ? null : "First name must be John",
      },
    ];

    const validator = new MobxEntityValidator(target, validations, false);

    expect(validator.isValid).toBeTruthy();
    expect(validator.errors.firstName).toBeNull();

    target.firstName = "Peter";

    expect(validator.isValid).toBeFalsy();
    expect(validator.errors.firstName).toBe("First name must be John");
  });

  it("initializes validation on empty field", () => {
    const target = observable({
    }) as any;

    const validations: IPropertyValidationDescriptor[] = [
      {
        propertyName: "firstName",
        validator: (value, entity) => value === "John" ? null : "First name must be John",
      },
    ];

    const validator = new MobxEntityValidator(target, validations, false);

    expect(validator.isValid).toBeFalsy();
    expect(validator.errors.firstName).toBe("First name must be John");

    target.firstName = "John";

    expect(validator.isValid).toBeTruthy();
    expect(validator.errors.firstName).toBeNull();
  });

  it("initializes validation on a non-observable entity", () => {
    const target = {
    } as any;

    const validations: IPropertyValidationDescriptor[] = [
      {
        propertyName: "firstName",
        validator: (value, entity) => value === "John" ? null : "First name must be John",
      },
    ];

    const validator = new MobxEntityValidator(target, validations, false);

    expect(validator.isValid).toBeFalsy();
    expect(validator.errors.firstName).toBe("First name must be John");

    target.firstName = "John";

    expect(validator.isValid).toBeTruthy();
    expect(validator.errors.firstName).toBeNull();
  });
});
