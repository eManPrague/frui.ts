import { isObservableProp, observable } from "mobx";
import { describe, expect, it } from "vitest";
import { ensureObservableProperty } from "../src/observableHelpers";

describe("ensureObservableProperty", () => {
  it("sets existing observable property", () => {
    const target = observable({
      firstName: "John",
    });

    ensureObservableProperty(target, "firstName", "Peter");
    expect(target.firstName).toBe("Peter");
    expect(isObservableProp(target, "firstName")).toBeTruthy();
  });

  it("creates new property on an observable object", () => {
    const target = observable({}) as any;

    ensureObservableProperty(target, "firstName", "Peter");
    expect(target.firstName).toBe("Peter");
    expect(isObservableProp(target, "firstName")).toBeTruthy();
  });

  it("sets existing non-observable property", () => {
    const target = {
      firstName: "John",
    };

    ensureObservableProperty(target, "firstName", "Peter");
    expect(target.firstName).toBe("Peter");
    expect(isObservableProp(target, "firstName")).toBeTruthy();
  });

  it("creates new property on a non-observable object", () => {
    const target = {} as any;

    ensureObservableProperty(target, "firstName", undefined);
    expect(target.firstName).toBeUndefined();
    expect(isObservableProp(target, "firstName")).toBeTruthy();
  });

  it("creates new property with default value on a non-observable object", () => {
    const target = {} as any;

    ensureObservableProperty(target, "firstName", "Peter");
    expect(target.firstName).toBe("Peter");
    expect(isObservableProp(target, "firstName")).toBeTruthy();
  });
});
