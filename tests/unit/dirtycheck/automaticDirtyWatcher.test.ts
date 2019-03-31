import AutomaticDirtyWatcher from "@src/dirtycheck/automaticDirtyWatcher";
import { observable } from "mobx";

describe("AutomaticDirtyWatcher", () => {
  test("initial state is not dirty", () => {
    const target = observable({
      firstName: "John",
    });

    const checker = new AutomaticDirtyWatcher(target, false);

    expect(checker.isDirty).toBeFalsy();
    expect(checker.dirtyProperties.firstName).toBeFalsy();
  });

  test("changing property value raises dirty flag", () => {
    const target = observable({
      firstName: "John",
    });

    const checker = new AutomaticDirtyWatcher(target, false);

    target.firstName = "Tom";
    expect(checker.isDirty).toBeTruthy();
    expect(checker.dirtyProperties.firstName).toBeTruthy();
  });

  test("reset() clears dirty flags", () => {
    const target = observable({
      firstName: "John",
    });

    const checker = new AutomaticDirtyWatcher(target, false);

    target.firstName = "Tom";

    expect(checker.isDirty).toBeTruthy();
    expect(checker.dirtyProperties.firstName).toBeTruthy();

    checker.reset();
    expect(checker.isDirty).toBeFalsy();
    expect(checker.dirtyProperties.firstName).toBeFalsy();
  });
});
