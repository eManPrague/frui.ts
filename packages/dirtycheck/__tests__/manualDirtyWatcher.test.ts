import { describe, expect, test } from "vitest";
import ManualDirtyWatcher from "../src/manualDirtyWatcher";
import { testCoreDirtyWatcherFunctions } from "./testHelpers";

interface ITarget {
  firstName: string;
}

describe("ManualDirtyWatcher", () => {
  testCoreDirtyWatcherFunctions(
    () => {
      const watcher = new ManualDirtyWatcher<ITarget>();
      watcher.setDirty("firstName", false);
      return watcher;
    },

    () => {
      const watcher = new ManualDirtyWatcher<ITarget>();
      watcher.setDirty("firstName", true);
      return watcher;
    },
    () => {
      return new ManualDirtyWatcher<ITarget>();
    }
  );

  test("initial state is not dirty", () => {
    const watcher = new ManualDirtyWatcher<ITarget>(false);

    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.checkDirty("firstName")).toBeFalsy();
  });

  test("setting dirty property changes isDirty flag", () => {
    const watcher = new ManualDirtyWatcher<ITarget>(false);

    watcher.setDirty("firstName");
    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.checkDirty("firstName")).toBeTruthy();
  });

  test("setDirty can be used to remove dirty flag", () => {
    const watcher = new ManualDirtyWatcher<ITarget>(false);

    watcher.setDirty("firstName", true);
    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.checkDirty("firstName")).toBeTruthy();

    watcher.setDirty("firstName", false);
    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.checkDirty("firstName")).toBeFalsy();
  });
});
