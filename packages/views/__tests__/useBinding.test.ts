import { isObservable, isObservableProp, observable, ObservableMap } from "mobx";
import { describe, expect, it } from "vitest";
import { getValue } from "../src/binding/useBinding";

describe("getValue", () => {
  it("gets value from observable map", () => {
    const target = new ObservableMap<string, number>();
    target.set("foo", 99);

    const value = getValue(target, "foo");
    expect(value).toBe(99);
  });

  it("gets value from map", () => {
    const target = new Map<string, number>();
    target.set("foo", 99);

    const value = getValue(target, "foo");
    expect(value).toBe(99);
  });

  it("gets value from observable object", () => {
    const target = observable({ foo: 99, bar: "John" });

    const value = getValue(target, "foo");
    expect(value).toBe(99);
  });

  it("gets value from object", () => {
    const target = { foo: 99, bar: "John" };

    const value = getValue(target, "foo", false);
    expect(value).toBe(99);
  });

  it("creates observable property", () => {
    const target = { foo: 99, bar: "John" };

    const value = getValue(target, "foo");
    expect(value).toBe(99);

    expect(isObservable(target)).toBe(true);
    expect(isObservableProp(target, "foo")).toBe(true);
  });
});
