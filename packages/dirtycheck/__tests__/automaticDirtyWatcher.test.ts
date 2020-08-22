import { observable } from "mobx";
import AutomaticDirtyWatcher from "../src/automaticDirtyWatcher";

describe("AutomaticDirtyWatcher", () => {
  test("initial state is not dirty", () => {
    const target = observable({
      firstName: "John",
    });

    const watcher = new AutomaticDirtyWatcher(target, false);

    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.dirtyProperties.firstName).toBeFalsy();
  });

  test("changing property value raises dirty flag", () => {
    const target = observable({
      firstName: "John",
    });

    const watcher = new AutomaticDirtyWatcher(target, false);

    target.firstName = "Tom";
    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.dirtyProperties.firstName).toBeTruthy();
  });

  test("property can be excluded", () => {
    const target = observable({
      firstName: "John",
    });

    const watcher = new AutomaticDirtyWatcher(target, false, { exclude: ["firstName"] });

    target.firstName = "Tom";
    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.dirtyProperties.firstName).toBeFalsy();
  });

  test("reset() clears dirty flags", () => {
    const target = observable({
      firstName: "John",
    });

    const watcher = new AutomaticDirtyWatcher(target, false);

    target.firstName = "Tom";

    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.dirtyProperties.firstName).toBeTruthy();

    watcher.reset();
    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.dirtyProperties.firstName).toBeFalsy();
  });
});
