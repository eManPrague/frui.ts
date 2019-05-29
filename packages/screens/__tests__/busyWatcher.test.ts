import BusyWatcher from "../src/structure/busyWatcher";

describe("BusyWatcher", () => {
  test("new busyWatcher is not busy", () => {
    const watcher = new BusyWatcher();
    expect(watcher.isBusy).toBeFalsy();
  });

  describe("getBusyTicket", () => {
    it("is busy when created", () => {
      const watcher = new BusyWatcher();
      watcher.getBusyTicket();

      expect(watcher.isBusy).toBeTruthy();
    });

    it("clears busy when called", () => {
      const watcher = new BusyWatcher();
      const ticket = watcher.getBusyTicket();

      ticket();
      expect(watcher.isBusy).toBeFalsy();
    });

    it("works only once", () => {
      const watcher = new BusyWatcher();
      const ticket1 = watcher.getBusyTicket();
      const ticket2 = watcher.getBusyTicket();

      ticket1();
      ticket1();
      ticket1();
      expect(watcher.isBusy).toBeTruthy();

      ticket2();
      expect(watcher.isBusy).toBeFalsy();

      ticket2();
      expect(watcher.isBusy).toBeFalsy();
    });
  });

  describe("watch", () => {
    it("is busy when created", () => {
      const watcher = new BusyWatcher();

      const promise = new Promise((resolve, reject) => null);
      watcher.watch(promise);

      expect(watcher.isBusy).toBeTruthy();
    });

    it("clears busy when promise resolved", async () => {
      const watcher = new BusyWatcher();

      let handler: () => void;
      const promise = new Promise((resolve, reject) => { handler = resolve; });
      watcher.watch(promise);

      expect(watcher.isBusy).toBeTruthy();

      handler();
      await promise;
      expect(watcher.isBusy).toBeFalsy();
    });

    it("clears busy when promise fails", async () => {
      const watcher = new BusyWatcher();

      let handler: () => void;
      const promise = new Promise((resolve, reject) => { handler = reject; });
      watcher.watch(promise);

      expect(watcher.isBusy).toBeTruthy();

      handler();

      try {
        await promise;
      } catch (e) {
        expect(e).not.toBeNull();
      }
      expect(watcher.isBusy).toBeFalsy();
    });
  });
});
