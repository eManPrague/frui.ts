import BusyWatcher from "../src/busyWatcher";
import { ManualPromise } from "@frui.ts/helpers";

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
      void watcher.watch(promise);

      expect(watcher.isBusy).toBeTruthy();
    });

    it("clears busy when promise resolved", async () => {
      const watcher = new BusyWatcher();

      const promise = new ManualPromise<any>();
      void watcher.watch(promise.promise);

      expect(watcher.isBusy).toBeTruthy();

      promise.resolve(undefined);
      await promise.promise;
      expect(watcher.isBusy).toBeFalsy();
    });

    it("clears busy when promise fails", async () => {
      const watcher = new BusyWatcher();

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      let handler = () => {};
      const promise = new Promise((resolve, reject) => {
        handler = reject;
      });
      void watcher.watch(promise);

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
