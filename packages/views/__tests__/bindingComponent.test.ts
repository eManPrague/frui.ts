import { computed, isObservableProp, observable, ObservableMap } from "mobx";
import { BindingComponent } from "../src/binding/bindingComponent";
import type { IBindingProps } from "../src/binding/bindingProps";

type TestControlProps<TTarget> = IBindingProps<TTarget> & { otherText?: string; otherValue?: any };

type Entity = { firstName?: string; lastName?: string };

class ComplexEntity {
  fullNameValue: string;

  @computed
  get fullName() {
    return "John Doe";
  }

  set fullName(value: string) {
    this.fullNameValue = value;
  }
}

class TestControl<TTarget> extends BindingComponent<TTarget, TestControlProps<TTarget>> {
  readValue() {
    return this.value;
  }

  writeValue(value: any) {
    this.setValue(value);
  }

  getInheritedProps() {
    return this.inheritedProps;
  }
}

describe("BindingComponent", () => {
  describe("BindingComponent.value", () => {
    it("reads target property value", () => {
      const entity = observable({
        firstName: "John",
      }) as Entity;

      const control = new TestControl({ target: entity, property: "firstName" });

      const result = control.readValue();
      expect(result).toBe("John");
    });

    it("reads target property value from a non-observable entity", () => {
      const entity = {
        firstName: "John",
      } as Entity;

      const control = new TestControl({ target: entity, property: "firstName" });

      const result = control.readValue();
      expect(result).toBe("John");
    });

    it("reads undefined target property value", () => {
      const entity = observable({
        firstName: "John",
      }) as Entity;

      const control = new TestControl({ target: entity, property: "lastName" });

      const result = control.readValue();
      expect(result).toBeUndefined();
    });

    it("reads from observable map", () => {
      const target = new ObservableMap<string, string>({
        firstName: "John",
      });

      const control = new TestControl({ target, property: "firstName" });

      const result = control.readValue();
      expect(result).toBe("John");
    });

    it("reads from property getter", () => {
      const target = new ComplexEntity();

      const control = new TestControl({ target, property: "fullName" });

      const result = control.readValue();
      expect(result).toBe("John Doe");
    });
  });

  describe("BindingComponent.setValue()", () => {
    it("sets existing value", () => {
      const entity = observable({
        firstName: "John",
      }) as Entity;

      const control = new TestControl({ target: entity, property: "firstName" });
      control.writeValue("Peter");

      expect(entity.firstName).toBe("Peter");
    });

    it("creates a new property if needed", () => {
      const entity = observable({
        firstName: "John",
      }) as Entity;

      const control = new TestControl({ target: entity, property: "lastName" });
      control.writeValue("Doe");

      expect((entity as any).lastName).toBe("Doe");
      expect(isObservableProp(entity, "lastName")).toBeTruthy();
    });

    it("sets value on non-observable", () => {
      const entity = {
        firstName: "John",
      } as Entity;

      const control = new TestControl({ target: entity, property: "firstName" });
      control.writeValue("Peter");

      expect(entity.firstName).toBe("Peter");
    });

    it("sets value on observable map", () => {
      const target = new ObservableMap<string, string>({
        firstName: "John",
      });

      const control = new TestControl({ target: target, property: "firstName" });
      control.writeValue("Peter");

      expect(target.get("firstName")).toBe("Peter");
    });

    it("sets value on property setter", () => {
      const target = new ComplexEntity();

      const control = new TestControl({ target: target, property: "fullName" });
      control.writeValue("Peter Doe");

      expect(target.fullNameValue).toBe("Peter Doe");
    });
  });

  describe("BindingComponent.inheritedProps", () => {
    it("returns props without keys used by BindingComponent", () => {
      const entity = observable({
        firstName: "John",
      }) as Entity;

      const control = new TestControl({
        target: entity,
        property: "lastName",
        onValueChanged: () => 1,
        otherText: "test",
        otherValue: { id: 1 },
      });

      const inheritedProps = control.getInheritedProps() as TestControlProps<Entity>;
      expect(inheritedProps.target).toBeUndefined();
      expect(inheritedProps.property).toBeUndefined();
      expect(inheritedProps.onValueChanged).toBeUndefined();

      expect(inheritedProps.otherText).toBe("test");
      expect(inheritedProps.otherValue.id).toBe(1);
    });
  });
});
