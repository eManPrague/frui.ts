/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ManualPromise } from "@frui.ts/helpers";
import TypedEventHub from "../../src/events/typedEventHub";
import type { NavigationContext } from "../../src/models/navigationContext";
import type ScreenLifecycleEventHub from "../../src/navigation/screenLifecycleEventHub";
import type { LifecycleScreenNavigator } from "../../src/navigation/types";
import type { HasLifecycleEvents, RequiredLifecycleEvents } from "../../src/screens/hasLifecycleHandlers";
import type ScreenBase from "../../src/screens/screenBase";

export function testLifecycle<TNavigator extends LifecycleScreenNavigator, TScreen extends HasLifecycleEvents>(
  navigatorFactory: (screen?: TScreen, eventHub?: ScreenLifecycleEventHub<TScreen>) => TNavigator
) {
  // TODO add other functions

  // TODO test activate/deactivate and isActive value

  describe("navigate", () => {
    it("sets the isActive property to true", async () => {
      const screen = {};
      const navigator = navigatorFactory(screen as any);

      expect(navigator.isActive).toBe(false);

      await navigator.navigate([]);

      expect(navigator.isActive).toBe(true);
    });
  });

  describe("deactivate", () => {
    it("sets the isActive property to false", async () => {
      const screen = {};
      const navigator = navigatorFactory(screen as any);

      await navigator.navigate([]);
      expect(navigator.isActive).toBe(true);

      await navigator.deactivate(true);
      expect(navigator.isActive).toBe(false);
    });
  });

  describe("canNavigate", () => {
    it("calls canNavigate on the screen", async () => {
      const screen = {
        canNavigate: jest.fn(() => false),
      };
      const navigator = navigatorFactory(screen as any);

      const result = await navigator.canNavigate([{ name: "screen" }]);
      expect(result).toBe(false);
      expect(screen.canNavigate).toBeCalled();
    });

    it("calls canNavigate on the screen's eventHub", async () => {
      let isCalled = false;
      const eventHub = new TypedEventHub<RequiredLifecycleEvents>();
      eventHub.on("canNavigate", () => {
        isCalled = true;
        return false;
      });

      const screen: Partial<ScreenBase> = {
        events: eventHub,
      };

      const navigator = navigatorFactory(screen as any);

      const result = await navigator.canNavigate([{ name: "screen" }]);
      expect(result).toBe(false);
      expect(isCalled).toBeTruthy();
    });

    it("calls canNavigate on the eventHub", async () => {
      let isCalled = false;
      const eventHub = new TypedEventHub<RequiredLifecycleEvents>();
      eventHub.on("canNavigate", () => {
        isCalled = true;
        return false;
      });

      const navigator = navigatorFactory({} as any, eventHub);

      const result = await navigator.canNavigate([{ name: "screen" }]);
      expect(result).toBe(false);
      expect(isCalled).toBeTruthy();
    });

    it("does not fail when no screen is provided", async () => {
      const navigator = navigatorFactory(undefined);

      const result = await navigator.canNavigate([{ name: "screen" }]);
      expect(result).toBe(true);
    });

    it("does not fail when no eventEmitter available", async () => {
      const navigator = navigatorFactory({} as any);

      const result = await navigator.canNavigate([{ name: "screen" }]);
      expect(result).toBe(true);
    });
  });

  describe("navigate", () => {
    it("will run initialize only once", async () => {
      const manualPromise = new ManualPromise<void>();

      let callsCounter = 0;

      const screen = {
        onInitialize: (_context: NavigationContext) => {
          callsCounter++;
          return manualPromise.promise;
        },
      };
      const navigator = navigatorFactory(screen as any);

      const callPromise1 = navigator.navigate([{ name: "screen" }]);
      const callPromise2 = navigator.navigate([{ name: "screen" }]);

      // give some time for the activate promises to start
      await new Promise(resolve => setTimeout(resolve));

      manualPromise.resolve();

      await Promise.all([callPromise1, callPromise2]);

      expect(callsCounter).toBe(1);
    });

    it("will run activate only once", async () => {
      const manualPromise = new ManualPromise<void>();

      let callsCounter = 0;

      const screen = {
        onActivate: (_context: NavigationContext) => {
          callsCounter++;
          return manualPromise.promise;
        },
      };
      const navigator = navigatorFactory(screen as any);

      const callPromise1 = navigator.navigate([{ name: "screen" }]);
      const callPromise2 = navigator.navigate([{ name: "screen" }]);

      // give some time for the activate promises to start
      await new Promise(resolve => setTimeout(resolve));

      manualPromise.resolve();

      await Promise.all([callPromise1, callPromise2]);

      expect(callsCounter).toBe(1);
    });

    it("will run navigate for all calls", async () => {
      const manualPromise = new ManualPromise<void>();

      let callsCounter = 0;

      const screen = {
        onNavigate: (_context: NavigationContext) => {
          callsCounter++;
          return manualPromise.promise;
        },
      };
      const navigator = navigatorFactory(screen as any);

      const callPromise1 = navigator.navigate([{ name: "screen" }]);
      const callPromise2 = navigator.navigate([{ name: "screen" }]);

      // give some time for the activate promises to start
      await new Promise(resolve => setTimeout(resolve));

      manualPromise.resolve();

      await Promise.all([callPromise1, callPromise2]);

      expect(callsCounter).toBe(2);
    });
  });
}
