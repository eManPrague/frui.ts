import { combinePath, splitUrlSegments } from "../src/navigation/navigationPath";

describe("combinePath", () => {
  it("combines base and child path with path delimiter", () => {
    const result = combinePath({ path: "basePath", isClosed: false }, "childPath");
    expect(result.path).toBe("basePath/childPath");
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
