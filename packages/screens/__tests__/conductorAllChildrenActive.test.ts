import ConductorAllChildrenActive from "../src/structure/conductorAllChildrenActive";
import ChildMock from "./mocks/childMock";

describe("ConductorAllChildrenActive", () => {
  describe("activate", () => {
    it("activates existing items", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();
      const conductor = new ConductorAllChildrenActive<ChildMock>();
      conductor.items.push(child1, child2);

      await conductor.activate();
      expect(conductor.isActive).toBeTruthy();
      expect(child1.calls.activate).toBe(1);
      expect(child2.calls.activate).toBe(1);
    });
  });

  describe("deactivate", () => {
    it("deactivates all items", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();
      const conductor = new ConductorAllChildrenActive<ChildMock>();

      await conductor.activate();
      conductor.items.push(child1, child2);

      await conductor.deactivate(false);
      expect(child1.calls.deactivate).toBe(1);
      expect(child2.calls.deactivate).toBe(1);
    });
    it("closes all children", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();

      const conductor = new ConductorAllChildrenActive<ChildMock>();
      await conductor.activate();
      conductor.items.push(child1, child2);

      await conductor.deactivate(true);
      expect(child1.calls.deactivate).toBe(1);
      expect(child2.calls.deactivate).toBe(1);
      expect(conductor.items.length).toBe(0);
    });
  });

  describe("activateItem", () => {
    it("activates the new item if active itsef", async () => {
      const child = new ChildMock();
      const conductor = new ConductorAllChildrenActive<ChildMock>();

      await conductor.activate();
      expect(conductor.isActive).toBeTruthy();

      await conductor.activateItem(child);
      expect(child.calls.activate).toBe(1);
    });
  });

  describe("deactivateItem", () => {
    it("deactivates the item", async () => {
      const child = new ChildMock();
      const conductor = new ConductorAllChildrenActive<ChildMock>();
      await conductor.activateItem(child);

      await conductor.deactivateItem(child, false);
      expect(child.calls.canClose).toBeUndefined();
      expect(child.calls.deactivate).toBe(1);
    });
    it("closes the item if possible", async () => {
      const child = new ChildMock();
      child.isCloseAllowed = true;
      const conductor = new ConductorAllChildrenActive<ChildMock>();
      await conductor.activateItem(child);

      await conductor.deactivateItem(child, true);
      expect(conductor.items).not.toContain(child);
      expect(child.calls.canClose).toBe(1);
      expect(child.calls.deactivate).toBe(1);
    });
    it("does not close the item if not allowed to close", async () => {
      const child = new ChildMock();
      child.isCloseAllowed = false;
      const conductor = new ConductorAllChildrenActive<ChildMock>();
      await conductor.activateItem(child);

      await conductor.deactivateItem(child, true);
      expect(conductor.items).toContain(child);
      expect(child.calls.canClose).toBe(1);
      expect(child.calls.deactivate).toBeUndefined();
    });
  });

  describe("items", () => {
    test("adding a new child sets parent link", () => {
      const child = new ChildMock();
      const conductor = new ConductorAllChildrenActive<ChildMock>();

      conductor.items.push(child);
      expect(child.parent).toBe(conductor);
    });

    test("adding a new item activates it if parent is active", async () => {
      const child = new ChildMock();
      const conductor = new ConductorAllChildrenActive<ChildMock>();

      await conductor.activate();
      conductor.items.push(child);
      expect(child.calls.activate).toBe(1);
    });
  });

  describe("canClose", () => {
    it("calls children, checks canClose and closes where possible", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();
      child2.isCloseAllowed = false;

      const conductor = new ConductorAllChildrenActive<ChildMock>();
      conductor.items.push(child1, child2);

      const canClose = await conductor.canClose();
      expect(canClose).toBeFalsy();
      expect(conductor.items).not.toContain(child1);
      expect(conductor.items).toContain(child2);
    });
  });
});
