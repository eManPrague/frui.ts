import { observable } from "mobx";
import AutomaticDirtyWatcher from "../src/automaticDirtyWatcher";
import { testCoreDirtyWatcherFunctions } from "./testHelpers";

describe("AutomaticDirtyWatcher", () => {
  testCoreDirtyWatcherFunctions(
    () => {
      const target = observable({
        firstName: "John",
      });
      const watcher = new AutomaticDirtyWatcher(target);
      target.firstName = "John";
      return watcher;
    },
    () => {
      const target = observable({
        firstName: "John",
      });
      const watcher = new AutomaticDirtyWatcher(target);
      target.firstName = "Tom";
      return watcher;
    },
    () => {
      const target = observable({
        firstName: "John",
      });
      return new AutomaticDirtyWatcher(target);
    }
  );

  test("property can be excluded", () => {
    const target = observable({
      firstName: "John",
    });
    const watcher = new AutomaticDirtyWatcher(target, { excludedProperties: ["firstName"] });

    target.firstName = "Tom";

    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.checkDirty("firstName")).toBeFalsy();
  });

  test("properties not excluded are watched", () => {
    const target = observable({
      firstName: "John",
      lastName: "Tom",
    });
    const watcher = new AutomaticDirtyWatcher(target, { excludedProperties: ["lastName"] });

    target.firstName = "Tom";

    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.checkDirty("firstName")).toBeTruthy();
  });

  test("property can be included", () => {
    const target = observable({
      firstName: "John",
    });
    const watcher = new AutomaticDirtyWatcher(target, { includedProperties: ["firstName"] });

    target.firstName = "Tom";

    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.checkDirty("firstName")).toBeTruthy();
  });

  test("properties not included are ignored", () => {
    const target = observable({
      firstName: "John",
      lastName: "Tom",
    });
    const watcher = new AutomaticDirtyWatcher(target, { includedProperties: ["lastName"] });

    target.firstName = "Tom";

    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.checkDirty("firstName")).toBeFalsy();
  });
});
