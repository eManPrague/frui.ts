import { isObservableProp, observable, ObservableMap } from "mobx";
import { getValue } from "../src/useBinding";

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

    expect(isObservableProp(target, "foo")).toBe(true);
  });
});
