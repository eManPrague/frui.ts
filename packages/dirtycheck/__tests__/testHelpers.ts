/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, test } from "vitest";
import type { EntityDirtyWatcher } from "../src/types";

export function testCoreDirtyWatcherFunctions<TEntity extends { firstName: string } = any>(
  cleanWatcher: () => EntityDirtyWatcher<TEntity>,
  dirtyWatcher: () => EntityDirtyWatcher<TEntity>,
  emptyWatcher: () => EntityDirtyWatcher<TEntity>
) {
  const getWatcher = (args: { state: string; isEnabled: boolean; isVisible: boolean }) => {
    let watcher: EntityDirtyWatcher<TEntity>;
    switch (args.state) {
      case "clean":
        watcher = cleanWatcher();
        break;
      case "dirty":
        watcher = dirtyWatcher();
        break;
      case "empty":
        watcher = emptyWatcher();
        break;
      default:
        throw new Error(`Unknown watcher state 'args.state}'`);
    }

    watcher.isEnabled = args.isEnabled;
    watcher.isVisible = args.isVisible;
    return watcher;
  };

  describe("getDirtyProperties", () => {
    test.each([
      ["clean", "no", false, false],
      ["clean", "no", false, true],
      ["clean", "no", true, false],
      ["clean", "no", true, true],
      ["dirty", "no", false, false],
      ["dirty", "no", false, true],
      ["dirty", "some", true, false],
      ["dirty", "some", true, true],
      ["empty", "no", false, false],
      ["empty", "no", false, true],
      ["empty", "no", true, false],
      ["empty", "no", true, true],
    ])(
      "%s watcher returns %s results when isEnabled:%o, isVisible:%o",
      (state: string, results: string, isEnabled: boolean, isVisible: boolean) => {
        const watcher = getWatcher({ state, isEnabled, isVisible });
        const properties = Array.from(watcher.getDirtyProperties());
        if (results === "no") {
          expect(properties).toHaveLength(0);
        } else {
          expect(properties).not.toHaveLength(0);
        }
      }
    );
  });

  describe("checkDirty", () => {
    test.each([
      ["clean", false, false, false],
      ["clean", false, false, true],
      ["clean", false, true, false],
      ["clean", false, true, true],
      ["dirty", false, false, false],
      ["dirty", false, false, true],
      ["dirty", true, true, false],
      ["dirty", true, true, true],
      ["empty", false, false, false],
      ["empty", false, false, true],
      ["empty", false, true, false],
      ["empty", false, true, true],
    ])(
      "%s watcher returns dirty:%s when isEnabled:%o, isVisible:%o",
      (state: string, dirty: boolean, isEnabled: boolean, isVisible: boolean) => {
        const watcher = getWatcher({ state, isEnabled, isVisible });
        const isDirty = watcher.checkDirty();
        expect(isDirty).toBe(dirty);
      }
    );
  });

  describe("checkDirty on existing property", () => {
    test.each([
      ["clean", false, false, false],
      ["clean", false, false, true],
      ["clean", false, true, false],
      ["clean", false, true, true],
      ["dirty", false, false, false],
      ["dirty", false, false, true],
      ["dirty", true, true, false],
      ["dirty", true, true, true],
      ["empty", false, false, false],
      ["empty", false, false, true],
      ["empty", false, true, false],
      ["empty", false, true, true],
    ])(
      "%s watcher returns dirty:%s when isEnabled:%o, isVisible:%o",
      (state: string, dirty: boolean, isEnabled: boolean, isVisible: boolean) => {
        const watcher = getWatcher({ state, isEnabled, isVisible });
        const isDirty = watcher.checkDirty("firstName");
        expect(isDirty).toBe(dirty);
      }
    );
  });

  describe("checkDirty on missing property", () => {
    test.each([
      ["clean", false, false, false],
      ["clean", false, false, true],
      ["clean", false, true, false],
      ["clean", false, true, true],
      ["dirty", false, false, false],
      ["dirty", false, false, true],
      ["dirty", false, true, false],
      ["dirty", false, true, true],
      ["empty", false, false, false],
      ["empty", false, false, true],
      ["empty", false, true, false],
      ["empty", false, true, true],
    ])(
      "%s watcher returns dirty:%s when isEnabled:%o, isVisible:%o",
      (state: string, dirty: boolean, isEnabled: boolean, isVisible: boolean) => {
        const watcher = getWatcher({ state, isEnabled, isVisible });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const isDirty = watcher.checkDirty("unknown" as any);
        expect(isDirty).toBe(dirty);
      }
    );
  });

  describe("getDirtyVisibleProperties", () => {
    test.each([
      ["clean", "no", false, false],
      ["clean", "no", false, true],
      ["clean", "no", true, false],
      ["clean", "no", true, true],
      ["dirty", "no", false, false],
      ["dirty", "no", false, true],
      ["dirty", "no", true, false],
      ["dirty", "some", true, true],
      ["empty", "no", false, false],
      ["empty", "no", false, true],
      ["empty", "no", true, false],
      ["empty", "no", true, true],
    ])(
      "%s watcher returns $results results when isEnabled:%o, isVisible:%o",
      (state: string, results: string, isEnabled: boolean, isVisible: boolean) => {
        const watcher = getWatcher({ state, isEnabled, isVisible });
        const properties = Array.from(watcher.getDirtyVisibleProperties());
        if (results === "no") {
          expect(properties).toHaveLength(0);
        } else {
          expect(properties).not.toHaveLength(0);
        }
      }
    );
  });

  describe("checkDirtyVisible on existing property", () => {
    test.each([
      ["clean", false, false, false],
      ["clean", false, false, true],
      ["clean", false, true, false],
      ["clean", false, true, true],
      ["dirty", false, false, false],
      ["dirty", false, false, true],
      ["dirty", false, true, false],
      ["dirty", true, true, true],
      ["empty", false, false, false],
      ["empty", false, false, true],
      ["empty", false, true, false],
      ["empty", false, true, true],
    ])(
      "%s watcher returns dirty:%s when isEnabled:%o, isVisible:%o",
      (state: string, dirty: boolean, isEnabled: boolean, isVisible: boolean) => {
        const watcher = getWatcher({ state, isEnabled, isVisible });
        const isDirty = watcher.checkDirtyVisible("firstName");
        expect(isDirty).toBe(dirty);
      }
    );
  });

  describe("checkDirtyVisible on missing property", () => {
    test.each([
      ["clean", false, false, false],
      ["clean", false, false, true],
      ["clean", false, true, false],
      ["clean", false, true, true],
      ["dirty", false, false, false],
      ["dirty", false, false, true],
      ["dirty", false, true, false],
      ["dirty", false, true, true],
      ["empty", false, false, false],
      ["empty", false, false, true],
      ["empty", false, true, false],
      ["empty", false, true, true],
    ])(
      "%s watcher returns dirty:%s when isEnabled:%o, isVisible:%o",
      (state: string, dirty: boolean, isEnabled: boolean, isVisible: boolean) => {
        const watcher = getWatcher({ state, isEnabled, isVisible });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const isDirty = watcher.checkDirtyVisible("unknown" as any);
        expect(isDirty).toBe(dirty);
      }
    );
  });

  test("reset() clears dirty flags", () => {
    const watcher = dirtyWatcher();
    expect(watcher.isDirty).toBeTruthy();

    watcher.reset();
    expect(watcher.isDirty).toBeFalsy();
  });
}
