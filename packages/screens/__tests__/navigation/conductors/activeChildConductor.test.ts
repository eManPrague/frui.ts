/* eslint-disable sonarjs/no-identical-functions */
import { mock } from "jest-mock-extended";
import type { ScreenBase, SimpleScreenNavigator } from "../../../src";
import { ActiveChildConductor } from "../../../src";
import { testLifecycle } from "../navigator.testHelpers";

describe("ActiveChildConductor", () => {
  testLifecycle((screen, eventHub) => {
    const conductor = new ActiveChildConductor(screen, "testpage", undefined, eventHub);
    conductor.findNavigationChild = () => Promise.resolve({ newChild: undefined });
    return conductor;
  });

  describe("canNavigate", () => {
    it("calls canChangeActiveChild", async () => {
      const conductor = new ActiveChildConductor();
      conductor.canChangeActiveChild = (context, currentChild) => {
        return Promise.resolve(false);
      };

      const result = await conductor.canNavigate([{ name: "my-child", params: { foo: "bar" } }]);

      expect(result).toBe(false);
    });
  });

  describe("navigate", () => {
    it("calls navigate on the active child", async () => {
      // arrange
      const childNavigator = mock<SimpleScreenNavigator>();
      const childScreen: Partial<ScreenBase> = { navigator: childNavigator };

      const conductor = new ActiveChildConductor();
      conductor.findNavigationChild = (context, currentChild) => {
        return Promise.resolve({
          newChild: childScreen,
        });
      };

      // act
      await conductor.navigate([{ name: "my-child", params: { foo: "bar" } }]);

      // assert
      expect(childNavigator.navigate).toBeCalledWith([]);
    });

    it("calls navigate on the active child even if is already active", async () => {
      // this feature is needed when the new navigation path differs deeper below the active child,
      // we still need to pass the navigation flow

      // arrange
      const childNavigator = mock<SimpleScreenNavigator>();
      const childScreen: Partial<ScreenBase> = { navigator: childNavigator };

      const conductor = new ActiveChildConductor();
      conductor.findNavigationChild = (context, currentChild) => {
        return Promise.resolve({
          newChild: childScreen,
        });
      };

      // act
      await conductor.navigate([{ name: "my-child", params: { foo: "bar" } }, { name: "grand-child1" }]);
      await conductor.navigate([{ name: "my-child", params: { foo: "bar" } }, { name: "grand-child2" }]);

      // assert
      expect(childNavigator.navigate).toBeCalledWith([{ name: "grand-child2" }]);
    });

    it("sets the active child", async () => {
      // arrange
      const childNavigator = mock<SimpleScreenNavigator>();
      const childScreen: Partial<ScreenBase> = { navigator: childNavigator };

      const conductor = new ActiveChildConductor();
      conductor.findNavigationChild = (context, currentChild) => {
        return Promise.resolve({
          newChild: childScreen,
        });
      };

      // act
      await conductor.navigate([{ name: "my-child", params: { foo: "bar" } }]);

      // assert
      expect(conductor.activeChild).toBe(childScreen);
    });

    it("calls deactivate on the previous child", async () => {
      const child1Navigator = mock<SimpleScreenNavigator>();
      child1Navigator.canDeactivate.mockReturnValue(Promise.resolve(false));
      const child1Screen: Partial<ScreenBase> = { navigator: child1Navigator };

      const conductor = new ActiveChildConductor();
      conductor.findNavigationChild = (context, currentChild) => {
        return Promise.resolve({
          newChild: child1Screen,
        });
      };
      await conductor.navigate([{ name: "my-child", params: { foo: "bar" } }]);

      // act
      conductor.findNavigationChild = (context, currentChild) => {
        return Promise.resolve({
          newChild: undefined,
          closePrevious: true,
        });
      };
      await conductor.navigate([]);

      // assert
      expect(conductor.activeChild).toBeUndefined();
      expect(child1Navigator.deactivate).toBeCalledWith(true);
    });
  });

  describe("canDeactivate", () => {
    it("calls canDeactivate on active child", async () => {
      // activate a child
      const childNavigator = mock<SimpleScreenNavigator>();
      childNavigator.canDeactivate.mockReturnValue(Promise.resolve(false));
      const childScreen: Partial<ScreenBase> = { navigator: childNavigator };

      const conductor = new ActiveChildConductor();
      conductor.findNavigationChild = (context, currentChild) => {
        return Promise.resolve({
          newChild: childScreen,
        });
      };
      await conductor.navigate([{ name: "my-child", params: { foo: "bar" } }]);

      // act
      const canDeactivate = await conductor.canDeactivate(true);

      // assert
      expect(canDeactivate).toBe(false);
      expect(childNavigator.canDeactivate).toBeCalledWith(true);
    });
  });

  describe("deactivate", () => {
    it("calls deactivate on active child", async () => {
      // activate a child
      const childNavigator = mock<SimpleScreenNavigator>();
      childNavigator.deactivate.mockReturnValue(Promise.resolve());
      const childScreen: Partial<ScreenBase> = { navigator: childNavigator };

      const conductor = new ActiveChildConductor();
      conductor.findNavigationChild = (context, currentChild) => {
        return Promise.resolve({
          newChild: childScreen,
        });
      };
      await conductor.navigate([{ name: "my-child", params: { foo: "bar" } }]);

      // act
      await conductor.deactivate(true);

      // assert
      expect(childNavigator.deactivate).toBeCalledWith(true);
    });
  });

  // TODO test proper child finding with navigationPrefix used
});
