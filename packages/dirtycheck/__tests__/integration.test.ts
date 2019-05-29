import { observable } from "mobx";
import * as DirtyCheck from "../src";

class TestEntity {
  @observable firstName: string;
  @observable lastName: string;
}

test("attachManualDirtyWatcher", () => {
  const entity = {
    firstName: "John",
    lastName: "Doe",
  };
  const typedEntity = DirtyCheck.attachManualDirtyWatcher(entity, false);

  expect(typedEntity.__dirtycheck.isDirty).toBeFalsy();
  expect(typedEntity.__dirtycheck.dirtyProperties.firstName).toBeFalsy();
  expect(typedEntity.__dirtycheck.dirtyProperties.lastName).toBeFalsy();

  typedEntity.__dirtycheck.setDirty("firstName");
  expect(typedEntity.__dirtycheck.isDirty).toBeTruthy();
  expect(typedEntity.__dirtycheck.dirtyProperties.firstName).toBeTruthy();
  expect(typedEntity.__dirtycheck.dirtyProperties.lastName).toBeFalsy();

  typedEntity.__dirtycheck.reset();
  expect(typedEntity.__dirtycheck.isDirty).toBeFalsy();
  expect(typedEntity.__dirtycheck.dirtyProperties.firstName).toBeFalsy();
  expect(typedEntity.__dirtycheck.dirtyProperties.lastName).toBeFalsy();
});

test("attachAutomaticDirtyWatcher", () => {
  const entity = {
    firstName: "John",
    lastName: "Doe",
  };
  const typedEntity = DirtyCheck.attachAutomaticDirtyWatcher(entity, false);

  expect(typedEntity.__dirtycheck.isDirty).toBeFalsy();
  expect(typedEntity.__dirtycheck.dirtyProperties.firstName).toBeFalsy();
  expect(typedEntity.__dirtycheck.dirtyProperties.lastName).toBeFalsy();

  entity.firstName = "Tom";
  expect(typedEntity.__dirtycheck.isDirty).toBeTruthy();
  expect(typedEntity.__dirtycheck.dirtyProperties.firstName).toBeTruthy();
  expect(typedEntity.__dirtycheck.dirtyProperties.lastName).toBeFalsy();

  typedEntity.__dirtycheck.reset();
  expect(typedEntity.__dirtycheck.isDirty).toBeFalsy();
  expect(typedEntity.__dirtycheck.dirtyProperties.firstName).toBeFalsy();
  expect(typedEntity.__dirtycheck.dirtyProperties.lastName).toBeFalsy();
});
