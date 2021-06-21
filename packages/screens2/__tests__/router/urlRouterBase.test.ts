import { mock } from "jest-mock-extended";
import { ScreenNavigator } from "../../src/navigation/types";
import PathElement from "../../src/models/pathElements";
import UrlRouterBase from "../../src/router/urlRouterBase";

class TestRouter extends UrlRouterBase {
  persistedPath: string;

  protected persistPath(path: string): Promise<void> {
    this.persistedPath = path;
    return Promise.resolve();
  }
}

describe("UrlRouterBase", () => {
  describe("initialize", () => {
    it("serializes and sets the current path", async () => {
      const navigator = mock<ScreenNavigator>();
      navigator.getNavigationPath.mockReturnValue([{ name: "my-screen" }]);

      const router = new TestRouter(navigator);

      await router.initialize();

      expect(router.persistedPath).toBe("my-screen");
    });
  });

  describe("setPath", () => {
    it("deserializes path and calls navigate", async () => {
      const navigator = mock<ScreenNavigator>();

      const router = new TestRouter(navigator);

      await router.setPath("my-screen");

      expect(navigator.navigate).toBeCalledWith([{ name: "my-screen" }]);
    });
  });

  describe("serialization", () => {
    it("does not change content", async () => {
      const path: PathElement[] = [{ name: "one" }, { name: "two-complex", params: { foo: "bar", now: "5" } }];

      const navigator = mock<ScreenNavigator>();
      navigator.getNavigationPath.mockReturnValue(path);

      const router = new TestRouter(navigator);

      await router.initialize();
      await router.setPath(router.persistedPath);

      expect(navigator.navigate).toBeCalledWith(path);
    });
  });
});
