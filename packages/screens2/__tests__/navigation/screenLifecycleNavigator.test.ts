import { ManualPromise } from "@frui.ts/helpers";
import TypedEventHub from "../../src/events/typedEventHub";
import ScreenLifecycleNavigator from "../../src/navigation/screenLifecycleNavigator";
import { NavigationContext } from "../../src/navigationContext";
import { HasLifecycleEvents } from "../../src/screens/hasLifecycleHandlers";
import ScreenBase from "../../src/screens/screenBase";

describe("ScreenLifecycleNavigator", () => {
  describe("canNavigate", () => {
    it("calls canNavigate on the viewModel", async () => {
      const screen = {
        canNavigate: jest.fn(() => false),
      };
      const navigator = new ScreenLifecycleNavigator(screen);

      const result = await navigator.canNavigate(undefined);
      expect(result).toBe(false);
      expect(screen.canNavigate).toBeCalled();
    });

    it("calls canNavigate on the viewModel's eventHub", async () => {
      let isCalled = false;
      const eventHub = new TypedEventHub<HasLifecycleEvents>();
      eventHub.on("canNavigate", () => {
        isCalled = true;
        return false;
      });

      const screen: Partial<ScreenBase> = {
        events: eventHub,
      };

      const navigator = new ScreenLifecycleNavigator(screen);

      const result = await navigator.canNavigate(undefined);
      expect(result).toBe(false);
      expect(isCalled).toBeTruthy();
    });

    it("calls canNavigate on the eventHub", async () => {
      let isCalled = false;
      const eventHub = new TypedEventHub<HasLifecycleEvents>();
      eventHub.on("canNavigate", () => {
        isCalled = true;
        return false;
      });

      const navigator = new ScreenLifecycleNavigator({}, eventHub);

      const result = await navigator.canNavigate(undefined);
      expect(result).toBe(false);
      expect(isCalled).toBeTruthy();
    });

    it("does not fail when no viewModel available", async () => {
      const navigator = new ScreenLifecycleNavigator({});

      const result = await navigator.canNavigate(undefined);
      expect(result).toBe(true);
    });

    it("does not fail when no eventEmitter available", async () => {
      const screen = {};
      const navigator = new ScreenLifecycleNavigator(screen);

      const result = await navigator.canNavigate(undefined);
      expect(result).toBe(true);
    });
  });

  describe("navigate", () => {
    it("will run initialize only once", async () => {
      const manualPromise = new ManualPromise<void>();

      let callsCounter = 0;

      const screen = {
        onInitialize: (context: NavigationContext) => {
          callsCounter++;
          return manualPromise.promise;
        },
      };
      const navigator = new ScreenLifecycleNavigator(screen);

      const callPromise1 = navigator.navigate(undefined);
      const callPromise2 = navigator.navigate(undefined);

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
        onActivate: (context: NavigationContext) => {
          callsCounter++;
          return manualPromise.promise;
        },
      };
      const navigator = new ScreenLifecycleNavigator(screen);

      const callPromise1 = navigator.navigate(undefined);
      const callPromise2 = navigator.navigate(undefined);

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
        onNavigate: (context: NavigationContext) => {
          callsCounter++;
          return manualPromise.promise;
        },
      };
      const navigator = new ScreenLifecycleNavigator(screen);

      const callPromise1 = navigator.navigate(undefined);
      const callPromise2 = navigator.navigate(undefined);

      // give some time for the activate promises to start
      await new Promise(resolve => setTimeout(resolve));

      manualPromise.resolve();

      await Promise.all([callPromise1, callPromise2]);

      expect(callsCounter).toBe(2);
    });
  });
});
