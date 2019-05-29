import { IHasNavigationName } from "../src/navigation/types";
import ConductorSingleChild from "../src/structure/conductorSingleChild";
import { IChild } from "../src/structure/types";
import ChildMock from "./mocks/childMock";

class Conductor<TChild extends IChild<any> & IHasNavigationName> extends ConductorSingleChild<TChild>
{
  protected getChild(navigationName: string) {
    return Promise.resolve(null);
  }
}

describe("ConductorSingleChild", () => {
  describe("activate", () => {
    it("activates existing activeItem", async () => {
      const child = new ChildMock();
      const conductor = new Conductor<ChildMock>();

      await conductor.activateItem(child);
      expect(conductor.isActive).toBeFalsy();
      expect(child.calls.activate).toBeUndefined();

      await conductor.activate();
      expect(conductor.isActive).toBeTruthy();
      expect(child.calls.activate).toBe(1);
    });
  });

  describe("deactivate", () => {
    it("deactivates existing activeItem", async () => {
      const child = new ChildMock();
      const conductor = new Conductor<ChildMock>();

      await conductor.activate();
      await conductor.activateItem(child);
      expect(child.calls.activate).toBe(1);
      expect(child.calls.deactivate).toBeUndefined();

      await conductor.deactivate(false);
      expect(child.calls.deactivate).toBe(1);
    });
  });

  describe("activateItem", () => {
    it("sets the new item as activeItem", async () => {
      const child = new ChildMock();
      const conductor = new Conductor<ChildMock>();

      expect(conductor.activeItem).toBeUndefined();

      await conductor.activateItem(child);

      expect(conductor.activeItem).toBe(child);
      expect(child.calls.activate).toBeUndefined();
    });
    it("activates the new item if active itsef", async () => {
      const child = new ChildMock();
      const conductor = new Conductor<ChildMock>();

      await conductor.activate();
      expect(conductor.isActive).toBeTruthy();

      await conductor.activateItem(child);

      expect(conductor.activeItem).toBe(child);
      expect(child.calls.activate).toBe(1);
    });
    it("closes the current activeItem", async () => {
      const child1 = new ChildMock();
      const conductor = new Conductor<ChildMock>();
      await conductor.activateItem(child1);

      const child2 = new ChildMock();
      await conductor.activateItem(child2);

      expect(conductor.activeItem).toBe(child2);
      expect(child1.calls.deactivate).toBe(1);
    });
  });

  describe("deactivateItem", () => {
    it("deactivates the current activeItem", async () => {
      const child = new ChildMock();
      const conductor = new Conductor<ChildMock>();
      await conductor.activateItem(child);

      await conductor.deactivateItem(child, false);
      expect(conductor.activeItem).toBe(child);
      expect(child.calls.canClose).toBeUndefined();
      expect(child.calls.deactivate).toBe(1);
    });
    it("closes the current activeItem if possible", async () => {
      const child = new ChildMock();
      child.isCloseAllowed = true;
      const conductor = new Conductor<ChildMock>();
      await conductor.activateItem(child);

      await conductor.deactivateItem(child, true);
      expect(conductor.activeItem).toBeNull();
      expect(child.calls.canClose).toBe(1);
      expect(child.calls.deactivate).toBe(1);
    });
    it("does not close the current activeItem if not allowed to close", async () => {
      const child = new ChildMock();
      child.isCloseAllowed = false;
      const conductor = new Conductor<ChildMock>();
      await conductor.activateItem(child);

      await conductor.deactivateItem(child, true);
      expect(conductor.activeItem).toBe(child);
      expect(child.calls.canClose).toBe(1);
      expect(child.calls.deactivate).toBeUndefined();
    });
  });
});
