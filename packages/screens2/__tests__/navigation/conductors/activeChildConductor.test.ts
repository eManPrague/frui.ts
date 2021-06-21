/* eslint-disable sonarjs/no-identical-functions */
import { mock } from "jest-mock-extended";
import ActiveChildConductor from "../../../src/navigation/conductors/activeChildConductor";
import { LifecycleScreenNavigator } from "../../../src/navigation/types";
import ScreenBase from "../../../src/screens/screenBase";
import { testLifecycle } from "../navigator.testHelpers";

describe("ActiveChildConductor", () => {
  testLifecycle((screen, eventHub) => {
    const conductor = new ActiveChildConductor(screen, eventHub);
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
      const childNavigator = mock<LifecycleScreenNavigator>();
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

    it("sets the active child", async () => {
      // arrange
      const childNavigator = mock<LifecycleScreenNavigator>();
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
      const child1Navigator = mock<LifecycleScreenNavigator>();
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

      expect(conductor.activeChild).toBeUndefined();
      expect(child1Navigator.deactivate).toBeCalledWith(true);
    });
  });

  describe("canDeactivate", () => {
    it("calls canDeactivate on active child", async () => {
      // activate a child
      const childNavigator = mock<LifecycleScreenNavigator>();
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
      expect(canDeactivate).toBe(false);
      expect(childNavigator.canDeactivate).toBeCalledWith(true);
    });
  });
});
