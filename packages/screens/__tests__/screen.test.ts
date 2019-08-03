import TestScreen from "./mocks/testScreen";

describe("Screen", () => {
  describe("activate", () => {
    it("will run only once", async () => {
      const screen = new TestScreen();
      screen.stopOnActivate = true;

      screen.activate();
      screen.activate();

      screen.finishActivate();

      await Promise.resolve();

      expect(screen.initialized).toBe(1);
      expect(screen.activated).toBe(1);
    });
  });

  describe("deactivate", () => {
    it("will run only once", async () => {
      const screen = new TestScreen();
      screen.stopOnDeactivate = true;

      await screen.activate();

      screen.deactivate(true);
      screen.deactivate(true);

      screen.finishDeactivate();

      await Promise.resolve();

      expect(screen.deactivated).toBe(1);
    });
  });
});
