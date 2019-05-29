import { isObservableProp, observable } from "mobx";
import { BindingComponent, IBindingProps } from "../src/bindingComponent";

type TestControlProps = IBindingProps<any> & { otherText?: string, otherValue?: any };

class TestControl extends BindingComponent<TestControlProps, any> {
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
      });

      const control = new TestControl({ target: entity, property: "firstName" });

      const result = control.readValue();
      expect(result).toBe("John");
    });

    it("reads target property value from a non-observable entity", () => {
      const entity = {
        firstName: "John",
      };

      const control = new TestControl({ target: entity, property: "firstName" });

      const result = control.readValue();
      expect(result).toBe("John");
    });

    it("reads undefined target property value", () => {
      const entity = observable({
        firstName: "John",
      });

      const control = new TestControl({ target: entity, property: "lastName" });

      const result = control.readValue();
      expect(result).toBeUndefined();
    });
  });

  describe("BindingComponent.setValue()", () => {
    it("sets existing value", () => {
      const entity = observable({
        firstName: "John",
      });

      const control = new TestControl({ target: entity, property: "firstName" });
      control.writeValue("Peter");

      expect(entity.firstName).toBe("Peter");
    });

    it("creates a new property if needed", () => {
      const entity = observable({
        firstName: "John",
      });

      const control = new TestControl({ target: entity, property: "lastName" });
      control.writeValue("Doe");

      expect((entity as any).lastName).toBe("Doe");
      expect(isObservableProp(entity, "lastName")).toBeTruthy();
    });

    it("sets value on non-observable", () => {
      const entity = {
        firstName: "John",
      };

      const control = new TestControl({ target: entity, property: "firstName" });
      control.writeValue("Peter");

      expect(entity.firstName).toBe("Peter");
    });
  });

  describe("BindingComponent.inheritedProps", () => {
    it("returns props without keys used by BindingComponent", () => {
      const entity = observable({
        firstName: "John",
      });

      const control = new TestControl({
        target: entity,
        property: "lastName",
        onValueChanged: () => 1,
        otherText: "test",
        otherValue: { id: 1 },
      });

      const { target, property, onValueChanged, otherText, otherValue } = control.getInheritedProps();
      expect(target).toBeUndefined();
      expect(property).toBeUndefined();
      expect(onValueChanged).toBeUndefined();

      expect(otherText).toBe("test");
      expect(otherValue.id).toBe(1);
    });
  });
});
