import ConductorOneChildActive from "../src/structure/conductorOneChildActive";
import ChildMock from "./mocks/childMock";

describe("ConductorOneChildActive", () => {
  describe("items", () => {
    test("adding a new child sets parent link", () => {
      const child = new ChildMock();
      const conductor = new ConductorOneChildActive<ChildMock>();

      conductor.items.push(child);
      expect(child.parent).toBe(conductor);
    });
  });

  describe("deactivate", () => {
    it("deactivates activeItem", async () => {
      const child = new ChildMock();
      const conductor = new ConductorOneChildActive<ChildMock>();

      conductor.items.push(child);
      await conductor.activate();
      await conductor.activateItem(child);
      expect(child.isActive).toBeTruthy();

      await conductor.deactivate(false);
      expect(child.isActive).toBeFalsy();
    });
    it("closes all children", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();

      const conductor = new ConductorOneChildActive<ChildMock>();
      await conductor.activate();
      conductor.items.push(child1, child2);

      await conductor.deactivate(true);
      expect(child1.calls.deactivate).toBe(1);
      expect(child2.calls.deactivate).toBe(1);
      expect(conductor.items.length).toBe(0);
    });
  });

  describe("deactivateItem", () => {
    it("opens another child when closing", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();

      const conductor = new ConductorOneChildActive<ChildMock>();
      conductor.items.push(child1, child2);

      await conductor.activateItem(child1);
      await conductor.deactivateItem(child1, true);

      expect(conductor.activeItem).toBe(child2);
    });
  });

  describe("canClose", () => {
    it("calls children, checks canClose and closes where possible", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();
      child2.isCloseAllowed = false;

      const conductor = new ConductorOneChildActive<ChildMock>();
      conductor.items.push(child1, child2);

      const canClose = await conductor.canClose();
      expect(canClose).toBeFalsy();
      expect(conductor.items).not.toContain(child1);
      expect(conductor.items).toContain(child2);
    });
  });
});
