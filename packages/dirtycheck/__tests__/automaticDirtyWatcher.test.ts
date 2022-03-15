import { observable } from "mobx";
import AutomaticDirtyWatcher, { attachAutomaticDirtyWatcher } from "../src/automaticDirtyWatcher";
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

  test("watching an array compares its content", () => {
    const target = observable({
      items: [1],
    });
    const watcher = new AutomaticDirtyWatcher(target);

    target.items.push(2);

    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.checkDirty("items")).toBeTruthy();

    target.items = [1];

    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.checkDirty("items")).toBeFalsy();
  });

  test("watching a Set compares its content", () => {
    const target = observable({
      items: new Set([1]),
    });
    const watcher = new AutomaticDirtyWatcher(target);

    target.items.add(2);

    expect(watcher.isDirty).toBeTruthy();
    expect(watcher.checkDirty("items")).toBeTruthy();

    target.items = new Set([1]);

    expect(watcher.isDirty).toBeFalsy();
    expect(watcher.checkDirty("items")).toBeFalsy();
  });

  test("watching an object with nested dirty watcher uses nested dirty watcher", () => {
    const nested = observable({
      firstName: "John",
    });
    const nestedWatcher = attachAutomaticDirtyWatcher(nested);

    const target = observable({
      person: nested,
    });
    const watcher = new AutomaticDirtyWatcher(target);

    nested.firstName = "Tom";

    expect(nestedWatcher.isDirty).toBeTruthy();
    expect(watcher.isDirty).toBeTruthy();
  });

  test("watching an object without nested dirty watcher checks reference only", () => {
    const nested = observable({
      firstName: "John",
    });

    const target = observable({
      person: nested,
    });
    const watcher = new AutomaticDirtyWatcher(target);

    target.person = observable({ firstName: "Tom" });

    expect(watcher.isDirty).toBeTruthy();
  });

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
