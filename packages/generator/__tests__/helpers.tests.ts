import { getRelativePath } from "../src/helpers";

describe("helpers", () => {
  describe("getRelativePath", () => {
    it("returns path based on the first common ancestor 1", () => {
      const result = getRelativePath("src/data/repositories", "src/entities");
      expect(result).toBe("../../entities");
    });

    it("returns path based on the first common ancestor 2", () => {
      const result = getRelativePath("src/repositories", "src/models/entities");
      expect(result).toBe("../models/entities");
    });

    it("returns local path when source and target is same", () => {
      const result = getRelativePath("src/repositories", "src/repositories");
      expect(result).toBe("./");
    });
  });
});
