import ConductorOneChildActive from "../src/structure/conductorOneChildActive";
import ChildMock from "./mocks/childMock";

class TestConductor<TChild extends ChildMock> extends ConductorOneChildActive<TChild> {
  deactivateChild(child: TChild, close: boolean) {
    return super.deactivateChild(child, close);
  }

  tryDeactivateChild(child: TChild, isClosing: boolean) {
    return super.tryDeactivateChild(child, isClosing);
  }
}

describe("ConductorOneChildActive", () => {
  describe("children", () => {
    test("adding a new child sets parent link", () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      conductor.children.push(child);
      expect(child.parent).toBe(conductor);
    });
  });

  describe("deactivate", () => {
    it("deactivates activeChild", async () => {
      const child = new ChildMock();
      const conductor = new TestConductor<ChildMock>();

      conductor.children.push(child);
      await conductor.activate();
      await conductor.tryActivateChild(child);
      expect(child.isActive).toBeTruthy();

      await conductor.deactivate(false);
      expect(child.isActive).toBeFalsy();
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

    it("does not activate other children when closing", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();

      const conductor = new TestConductor<ChildMock>();
      await conductor.activate();
      conductor.children.push(child1, child2);

      await conductor.tryActivateChild(child1);
      expect(child1.calls.activate).toBe(1);

      await conductor.tryActivateChild(child2);
      expect(child1.calls.deactivate).toBe(1);
      expect(child2.calls.activate).toBe(1);

      await conductor.deactivate(true);
      expect(child1.calls.activate).toBe(1);
      expect(child1.calls.deactivate).toBe(2);
      expect(child2.calls.activate).toBe(1);
      expect(child2.calls.deactivate).toBe(1);
      expect(conductor.children.length).toBe(0);
    });
  });

  describe("deactivateChild", () => {
    it("opens another child when closing", async () => {
      const child1 = new ChildMock();
      const child2 = new ChildMock();

      const conductor = new TestConductor<ChildMock>();
      conductor.children.push(child1, child2);

      await conductor.tryActivateChild(child1);
      await conductor.deactivateChild(child1, true);

      expect(conductor.activeChild).toBe(child2);
    });
  });
});
