import ConductorSingleChild from "../src/structure/conductorSingleChild";
import ChildMock from "./mocks/childMock";

class TestConductor<TChild extends ChildMock> extends ConductorSingleChild<TChild> {
  deactivateChild(child: TChild, close: boolean) {
    return super.deactivateChild(child, close);
  }
}

describe("ConductorSingleChild", () => {
  describe("activate", () => {
    it("activates existing activeChild", async () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      await conductor.activateChild(child);
      expect(conductor.isActive).toBeFalsy();
      expect(child.calls.activate).toBeUndefined();

      await conductor.activate();
      expect(conductor.isActive).toBeTruthy();
      expect(child.calls.activate).toBe(1);
    });
  });

  describe("deactivate", () => {
    it("deactivates existing activeChild", async () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      await conductor.activate();
      await conductor.activateChild(child);
      expect(child.calls.activate).toBe(1);
      expect(child.calls.deactivate).toBeUndefined();

      await conductor.deactivate(false);
      expect(child.calls.deactivate).toBe(1);
    });
  });

  describe("activateChild", () => {
    it("sets the new child as activeChild", async () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      expect(conductor.activeChild).toBeUndefined();

      await conductor.activateChild(child);

      expect(conductor.activeChild).toBe(child);
      expect(child.calls.activate).toBeUndefined();
    });

    it("activates the new child if active itsef", async () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      await conductor.activate();
      expect(conductor.isActive).toBeTruthy();

      await conductor.activateChild(child);

      expect(conductor.activeChild).toBe(child);
      expect(child.calls.activate).toBe(1);
    });

    it("closes the current activeChild", async () => {
      const child1 = new ChildMock();
      const conductor = new TestConductor<ChildMock>();
      await conductor.activateChild(child1);

      const child2 = new ChildMock();
      await conductor.activateChild(child2);

      expect(conductor.activeChild).toBe(child2);
      expect(child1.calls.deactivate).toBe(1);
    });
  });

  describe("deactivateChild", () => {
    it("deactivates the current activeChild", async () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();
      await conductor.activateChild(child);

      await conductor.deactivateChild(child, false);
      expect(conductor.activeChild).toBe(child);
      expect(child.calls.canClose).toBeUndefined();
      expect(child.calls.deactivate).toBe(1);
    });

    it("closes the current activeChild if possible", async () => {
      const child = new ChildMock();
      child.isCloseAllowed = true;
      const conductor = new TestConductor<ChildMock>();
      await conductor.activateChild(child);

      await conductor.deactivateChild(child, true);
      expect(conductor.activeChild).toBeUndefined();
      expect(child.calls.canClose).toBe(1);
      expect(child.calls.deactivate).toBe(1);
    });

    it("does not close the current activeChild if not allowed to close", async () => {
      const child = new ChildMock();
      child.isCloseAllowed = false;
      const conductor = new TestConductor<ChildMock>();
      await conductor.activateChild(child);

      await conductor.deactivateChild(child, true);
      expect(conductor.activeChild).toBe(child);
      expect(child.calls.canClose).toBe(1);
      expect(child.calls.deactivate).toBeUndefined();
    });
  });
});
