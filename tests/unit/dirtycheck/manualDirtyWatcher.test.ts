import ManualDirtyWatcher from "@src/dirtycheck/manualDirtyWatcher";

describe("ManualDirtyWatcher", () => {
  test("initial state is not dirty", () => {
    const checker = new ManualDirtyWatcher({ firstName: "John" }, false);

    expect(checker.isDirty).toBeFalsy();
    expect(checker.dirtyProperties.firstName).toBeUndefined();
  });

  test("setting dirty property changes isDirty flag", () => {
    const checker = new ManualDirtyWatcher({ firstName: "John" }, false);

    checker.setDirty("firstName");
    expect(checker.isDirty).toBeTruthy();
    expect(checker.dirtyProperties.firstName).toBeTruthy();
  });

  test("reset() clears dirty flags", () => {
    const checker = new ManualDirtyWatcher({ firstName: "John" }, false);

    checker.setDirty("firstName");
    expect(checker.isDirty).toBeTruthy();
    expect(checker.dirtyProperties.firstName).toBeTruthy();

    checker.reset();
    expect(checker.isDirty).toBeFalsy();
    expect(checker.dirtyProperties.firstName).toBeFalsy();
  });
});
