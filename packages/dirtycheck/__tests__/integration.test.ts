import * as DirtyCheck from "../src";

test("attachManualDirtyWatcher", () => {
  const entity = {
    firstName: "John",
    lastName: "Doe",
  };
  const typedEntity = DirtyCheck.attachManualDirtyWatcher(entity, false);

  expect(DirtyCheck.isDirty(typedEntity)).toBeFalsy();
  expect(DirtyCheck.isDirty(typedEntity, "firstName")).toBeFalsy();
  expect(DirtyCheck.isDirty(typedEntity, "lastName")).toBeFalsy();

  DirtyCheck.setDirty(typedEntity, "firstName");
  expect(DirtyCheck.isDirty(typedEntity)).toBeTruthy();
  expect(DirtyCheck.isDirty(typedEntity, "firstName")).toBeTruthy();
  expect(DirtyCheck.isDirty(typedEntity, "lastName")).toBeFalsy();

  DirtyCheck.setDirty(typedEntity, "lastName");
  expect(DirtyCheck.isDirty(typedEntity)).toBeTruthy();
  expect(DirtyCheck.isDirty(typedEntity, "firstName")).toBeTruthy();
  expect(DirtyCheck.isDirty(typedEntity, "lastName")).toBeTruthy();

  DirtyCheck.setDirty(typedEntity, "firstName", false);
  expect(DirtyCheck.isDirty(typedEntity)).toBeTruthy();
  expect(DirtyCheck.isDirty(typedEntity, "firstName")).toBeFalsy();
  expect(DirtyCheck.isDirty(typedEntity, "lastName")).toBeTruthy();

  DirtyCheck.resetDirty(typedEntity);
  expect(DirtyCheck.isDirty(typedEntity)).toBeFalsy();
  expect(DirtyCheck.isDirty(typedEntity, "firstName")).toBeFalsy();
  expect(DirtyCheck.isDirty(typedEntity, "lastName")).toBeFalsy();
});

test("attachAutomaticDirtyWatcher", () => {
  const entity = {
    firstName: "John",
    lastName: "Doe",
  };
  const typedEntity = DirtyCheck.attachAutomaticDirtyWatcher(entity, false);

  expect(DirtyCheck.isDirty(typedEntity)).toBeFalsy();
  expect(DirtyCheck.isDirty(typedEntity, "firstName")).toBeFalsy();
  expect(DirtyCheck.isDirty(typedEntity, "lastName")).toBeFalsy();

  entity.firstName = "Tom";
  expect(DirtyCheck.isDirty(typedEntity)).toBeTruthy();
  expect(DirtyCheck.isDirty(typedEntity, "firstName")).toBeTruthy();
  expect(DirtyCheck.isDirty(typedEntity, "lastName")).toBeFalsy();

  DirtyCheck.resetDirty(typedEntity);
  expect(DirtyCheck.isDirty(typedEntity)).toBeFalsy();
  expect(DirtyCheck.isDirty(typedEntity, "firstName")).toBeFalsy();
  expect(DirtyCheck.isDirty(typedEntity, "lastName")).toBeFalsy();
});
