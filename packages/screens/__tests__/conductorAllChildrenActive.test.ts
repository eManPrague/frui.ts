import ConductorAllChildrenActive from "../src/structure/conductorAllChildrenActive";
import ChildMock from "./mocks/childMock";

class TestConductor<TChild extends ChildMock> extends ConductorAllChildrenActive<TChild> {
  deactivateChild(child: TChild, close: boolean) {
    return super.deactivateChild(child, close);
  }

  tryDeactivateChild(child: TChild, isClosing: boolean) {
    return super.tryDeactivateChild(child, isClosing);
  }
}

describe("ConductorAllChildrenActive", () => {
  describe("activate", () => {
    it("activates existing children", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();
      const conductor = new TestConductor<ChildMock>();
      conductor.children.push(child1, child2);

      await conductor.activate();
      expect(conductor.isActive).toBeTruthy();
      expect(child1.calls.activate).toBe(1);
      expect(child2.calls.activate).toBe(1);
    });
  });

  describe("deactivate", () => {
    it("deactivates all children", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      await conductor.activate();
      conductor.children.push(child1, child2);

      await conductor.deactivate(false);
      expect(child1.calls.deactivate).toBe(1);
      expect(child2.calls.deactivate).toBe(1);
    });
    it("closes all children", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();

      const conductor = new TestConductor<ChildMock>();
      await conductor.activate();
      conductor.children.push(child1, child2);

      await conductor.deactivate(true);
      expect(child1.calls.deactivate).toBe(1);
      expect(child2.calls.deactivate).toBe(1);
      expect(conductor.children.length).toBe(0);
    });
  });

  describe("tryActivateChild", () => {
    it("activates the new child if active itsef", async () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      await conductor.activate();
      expect(conductor.isActive).toBeTruthy();

      await conductor.tryActivateChild(child);
      expect(child.calls.activate).toBeTruthy();
    });
  });

  describe("tryDeactivateChild", () => {
    it("closes the child if possible", async () => {
      const child = new ChildMock();
      child.isCloseAllowed = true;
      const conductor = new TestConductor<ChildMock>();
      await conductor.tryActivateChild(child);

      const result = await conductor.tryDeactivateChild(child, true);
      expect(conductor.children).not.toContain(child);
      expect(child.calls.canDeactivate).toBe(1);
      expect(child.calls.deactivate).toBe(1);
      expect(result).toBe(true);
    });

    it("does not close the child if not allowed to close", async () => {
      const child = new ChildMock();
      child.isCloseAllowed = false;
      const conductor = new TestConductor<ChildMock>();
      await conductor.tryActivateChild(child);

      const result = await conductor.tryDeactivateChild(child, true);
      expect(conductor.children).toContain(child);
      expect(child.calls.canDeactivate).toBe(1);
      expect(child.calls.deactivate).toBeUndefined();
      expect(result).toBe(false);
    });
  });

  describe("deactivateChild", () => {
    it("deactivates the child", async () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();
      await conductor.tryActivateChild(child);

      await conductor.deactivateChild(child, false);
      expect(child.calls.canDeactivate).toBeUndefined();
      expect(child.calls.deactivate).toBe(1);
    });
  });

  describe("children", () => {
    test("adding a new child sets parent link", () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      conductor.children.push(child);
      expect(child.parent).toBe(conductor);
    });

    test("adding a new child activates it if parent is active", async () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      await conductor.activate();
      conductor.children.push(child);
      expect(child.calls.activate).toBe(1);
    });
  });
});
