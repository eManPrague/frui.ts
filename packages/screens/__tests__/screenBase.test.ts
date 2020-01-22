import TestScreen from "./mocks/testScreen";

describe("Screen", () => {
  describe("activate", () => {
    it("will run only once", async () => {
      const screen = new TestScreen();
      screen.stopOnActivate = true;

      const activatePromise1 = screen.activate();
      const activatePromise2 = screen.activate();

      // give some time for the activate promises to start
      await new Promise(resolve => setTimeout(resolve));

      screen.finishActivate();

      await Promise.all([activatePromise1, activatePromise2]);

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
