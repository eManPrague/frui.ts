import { combineNavigationPath, splitNavigationPath } from "@src/navigation/navigationPath";

describe("combineNavigationPath", () => {
  it("combines base and child path with path delimiter", () => {
    const result = combineNavigationPath("basePath", "childPath");
    expect(result).toBe("basePath/childPath");
  });

  it("returns base if path element is empty", () => {
    const result = combineNavigationPath("basePath", undefined);
    expect(result).toBe("basePath");
  });

  it("returns path element if base is empty", () => {
    const result = combineNavigationPath(undefined, "childPath");
    expect(result).toBe("childPath");
  });
});

describe("splitNavigationPath", () => {
  it("returns first navigation element and the rest", () => {
    const result = splitNavigationPath("basePath/childPath");
    expect(result).toEqual(["basePath", "childPath"]);
  });

  it("returns only single element if no path delimiter is used", () => {
    const result = splitNavigationPath("basePath");
    expect(result).toEqual(["basePath", undefined]);
  });
});
