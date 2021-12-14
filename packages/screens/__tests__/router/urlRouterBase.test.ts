import { mock } from "jest-mock-extended";
import type { ScreenNavigator } from "../../src/navigation/types";
import UrlRouterBase from "../../src/router/urlRouterBase";

class TestRouter extends UrlRouterBase {
  persistedPath: string;

  protected persistUrl(path: string): Promise<void> {
    this.persistedPath = path;
    return Promise.resolve();
  }
}

describe("UrlRouterBase", () => {
  describe("initialize", () => {
    it("serializes and sets the current path", async () => {
      const navigator = mock<ScreenNavigator>();
      navigator.getNavigationState.mockReturnValue([{ name: "my-screen" }]);

      const router = new TestRouter(navigator);

      await router.initialize();

      expect(router.persistedPath).toBe("/my-screen");
    });
  });

  describe("navigate", () => {
    it("deserializes path and calls navigate", async () => {
      const navigator = mock<ScreenNavigator>();
      navigator.getNavigationState.mockReturnValue([{ name: "my-screen" }]);

      const router = new TestRouter(navigator);

      await router.navigate("/my-screen");

      expect(navigator.navigate).toBeCalledWith([{ name: "my-screen" }]);
    });
  });
});
