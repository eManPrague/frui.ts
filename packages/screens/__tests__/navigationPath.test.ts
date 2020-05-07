import { combinePath, splitUrlSegments, combinePathString } from "../src/navigation/navigationPath";

describe("combinePathString", () => {
  it("combines base and path with path delimiter", () => {
    const result = combinePathString("bar", "foo");
    expect(result).toBe("bar/foo");
  });
  it("returns base when path is empty", () => {
    const result = combinePathString("bar", "");
    expect(result).toBe("bar");
  });
  it("returns base when path is undefined", () => {
    const result = combinePathString("bar");
    expect(result).toBe("bar");
  });
  it("returns path when base is empty", () => {
    const result = combinePathString("", "foo");
    expect(result).toBe("foo");
  });
  it("return path when base is undefined", () => {
    const result = combinePathString(undefined, "foo");
    expect(result).toBe("foo");
  });
});

describe("combinePath", () => {
  it("combines base and child path with path delimiter", () => {
    const result = combinePath({ path: "basePath", isClosed: false }, "childPath");
    expect(result.path).toBe("basePath/childPath");
  });
  it("uses base params when new params are undefined", () => {
    const result = combinePath({ path: "basePath", params: { foo: "bar" }, isClosed: false }, "childPath");
    expect(result.params).toEqual({ foo: "bar" });
  });
  it("uses new params when base params are undefined", () => {
    const result = combinePath({ path: "basePath", isClosed: false }, "childPath", { foo: "bar" });
    expect(result.params).toEqual({ foo: "bar" });
  });
  it("uses combines params when both are defined", () => {
    const result = combinePath({ path: "basePath", params: { foo: "old", bar: "old" }, isClosed: false }, "childPath", {
      foo: "new",
      baz: "new",
    });
    expect(result.params).toEqual({ foo: "new", bar: "old", baz: "new" });
  });
});

describe("splitUrlSegments", () => {
  it("returns first navigation element and the rest", () => {
    const result = splitUrlSegments("basePath/childPath");
    expect(result).toEqual(["basePath", "childPath"]);
  });

  it("returns only single element if no path delimiter is used", () => {
    const result = splitUrlSegments("basePath");
    expect(result).toEqual(["basePath", undefined]);
  });

  it("skips leading slash", () => {
    const result = splitUrlSegments("/basePath");
    expect(result).toEqual(["basePath", undefined]);
  });

  it("returns first navigation element and the rest if leading slash present", () => {
    const result = splitUrlSegments("/basePath/childPath/foo");
    expect(result).toEqual(["basePath", "childPath/foo"]);
  });
});
