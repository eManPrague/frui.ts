import ManualDirtyWatcher from "../src/manualDirtyWatcher";
import { IManualDirtyWatcher } from "../src/types";

describe("ManualDirtyWatcher", () => {
  test("initial state is not dirty", () => {
    const watcher = new ManualDirtyWatcher({ firstName: "John" }, false);

    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.dirtyProperties.firstName).toBeUndefined();
  });

  test("setting dirty property changes isDirty flag", () => {
    const watcher = new ManualDirtyWatcher({ firstName: "John" }, false);

    watcher.setDirty("firstName");
    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.dirtyProperties.firstName).toBeTruthy();
  });

  test("setDirty can be used to remove dirty flag", () => {
    const watcher = new ManualDirtyWatcher({ firstName: "John" }, false);

    watcher.setDirty("firstName", true);
    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.dirtyProperties.firstName).toBeTruthy();

    watcher.setDirty("firstName", false);
    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.dirtyProperties.firstName).toBeFalsy();
  });

  test("reset() clears dirty flags", () => {
    const watcher = new ManualDirtyWatcher({ firstName: "John" }, false);

    watcher.setDirty("firstName");
    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.dirtyProperties.firstName).toBeTruthy();

    watcher.reset();
    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.dirtyProperties.firstName).toBeFalsy();
  });
});
