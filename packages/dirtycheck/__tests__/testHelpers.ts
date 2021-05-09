/* eslint-disable sonarjs/no-duplicate-string */
import { EntityDirtyWatcher } from "../src/types";

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
        throw new Error(`Unknown watcher state '${args.state}'`);
    }

    watcher.isEnabled = args.isEnabled;
    watcher.isVisible = args.isVisible;
    return watcher;
  };

  describe("getDirtyProperties", () => {
    test.each`
      state      | isEnabled | isVisible | results
      ${"clean"} | ${false}  | ${false}  | ${"no"}
      ${"clean"} | ${false}  | ${true}   | ${"no"}
      ${"clean"} | ${true}   | ${false}  | ${"no"}
      ${"clean"} | ${true}   | ${true}   | ${"no"}
      ${"dirty"} | ${false}  | ${false}  | ${"no"}
      ${"dirty"} | ${false}  | ${true}   | ${"no"}
      ${"dirty"} | ${true}   | ${false}  | ${"some"}
      ${"dirty"} | ${true}   | ${true}   | ${"some"}
      ${"empty"} | ${false}  | ${false}  | ${"no"}
      ${"empty"} | ${false}  | ${true}   | ${"no"}
      ${"empty"} | ${true}   | ${false}  | ${"no"}
      ${"empty"} | ${true}   | ${true}   | ${"no"}
    `(
      "$state watcher returns $results results when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; results: string }) => {
        const watcher = getWatcher(args);
        const results = Array.from(watcher.getDirtyProperties());
        if (args.results === "no") {
          expect(results).toHaveLength(0);
        } else {
          expect(results).not.toHaveLength(0);
        }
      }
    );
  });

  describe("checkDirty", () => {
    test.each`
      state      | isEnabled | isVisible | dirty
      ${"clean"} | ${false}  | ${false}  | ${false}
      ${"clean"} | ${false}  | ${true}   | ${false}
      ${"clean"} | ${true}   | ${false}  | ${false}
      ${"clean"} | ${true}   | ${true}   | ${false}
      ${"dirty"} | ${false}  | ${false}  | ${false}
      ${"dirty"} | ${false}  | ${true}   | ${false}
      ${"dirty"} | ${true}   | ${false}  | ${true}
      ${"dirty"} | ${true}   | ${true}   | ${true}
      ${"empty"} | ${false}  | ${false}  | ${false}
      ${"empty"} | ${false}  | ${true}   | ${false}
      ${"empty"} | ${true}   | ${false}  | ${false}
      ${"empty"} | ${true}   | ${true}   | ${false}
    `(
      "$state watcher returns dirty:$dirty when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; dirty: boolean }) => {
        const watcher = getWatcher(args);
        const isDirty = watcher.checkDirty();
        expect(isDirty).toBe(args.dirty);
      }
    );
  });

  describe("checkDirty on existing property", () => {
    test.each`
      state      | isEnabled | isVisible | dirty
      ${"clean"} | ${false}  | ${false}  | ${false}
      ${"clean"} | ${false}  | ${true}   | ${false}
      ${"clean"} | ${true}   | ${false}  | ${false}
      ${"clean"} | ${true}   | ${true}   | ${false}
      ${"dirty"} | ${false}  | ${false}  | ${false}
      ${"dirty"} | ${false}  | ${true}   | ${false}
      ${"dirty"} | ${true}   | ${false}  | ${true}
      ${"dirty"} | ${true}   | ${true}   | ${true}
      ${"empty"} | ${false}  | ${false}  | ${false}
      ${"empty"} | ${false}  | ${true}   | ${false}
      ${"empty"} | ${true}   | ${false}  | ${false}
      ${"empty"} | ${true}   | ${true}   | ${false}
    `(
      "$state watcher returns dirty:$dirty when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; dirty: boolean }) => {
        const watcher = getWatcher(args);
        const isDirty = watcher.checkDirty("firstName");
        expect(isDirty).toBe(args.dirty);
      }
    );
  });

  describe("checkDirty on missing property", () => {
    test.each`
      state      | isEnabled | isVisible | dirty
      ${"clean"} | ${false}  | ${false}  | ${false}
      ${"clean"} | ${false}  | ${true}   | ${false}
      ${"clean"} | ${true}   | ${false}  | ${false}
      ${"clean"} | ${true}   | ${true}   | ${false}
      ${"dirty"} | ${false}  | ${false}  | ${false}
      ${"dirty"} | ${false}  | ${true}   | ${false}
      ${"dirty"} | ${true}   | ${false}  | ${false}
      ${"dirty"} | ${true}   | ${true}   | ${false}
      ${"empty"} | ${false}  | ${false}  | ${false}
      ${"empty"} | ${false}  | ${true}   | ${false}
      ${"empty"} | ${true}   | ${false}  | ${false}
      ${"empty"} | ${true}   | ${true}   | ${false}
    `(
      "$state watcher returns dirty:$dirty when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; dirty: boolean }) => {
        const watcher = getWatcher(args);
        const isDirty = watcher.checkDirty("unknown" as any);
        expect(isDirty).toBe(args.dirty);
      }
    );
  });

  describe("getDirtyVisibleProperties", () => {
    test.each`
      state      | isEnabled | isVisible | results
      ${"clean"} | ${false}  | ${false}  | ${"no"}
      ${"clean"} | ${false}  | ${true}   | ${"no"}
      ${"clean"} | ${true}   | ${false}  | ${"no"}
      ${"clean"} | ${true}   | ${true}   | ${"no"}
      ${"dirty"} | ${false}  | ${false}  | ${"no"}
      ${"dirty"} | ${false}  | ${true}   | ${"no"}
      ${"dirty"} | ${true}   | ${false}  | ${"no"}
      ${"dirty"} | ${true}   | ${true}   | ${"some"}
      ${"empty"} | ${false}  | ${false}  | ${"no"}
      ${"empty"} | ${false}  | ${true}   | ${"no"}
      ${"empty"} | ${true}   | ${false}  | ${"no"}
      ${"empty"} | ${true}   | ${true}   | ${"no"}
    `(
      "$state watcher returns $results results when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; results: string }) => {
        const watcher = getWatcher(args);
        const results = Array.from(watcher.getDirtyVisibleProperties());
        if (args.results === "no") {
          expect(results).toHaveLength(0);
        } else {
          expect(results).not.toHaveLength(0);
        }
      }
    );
  });

  describe("checkDirtyVisible on existing property", () => {
    test.each`
      state      | isEnabled | isVisible | dirty
      ${"clean"} | ${false}  | ${false}  | ${false}
      ${"clean"} | ${false}  | ${true}   | ${false}
      ${"clean"} | ${true}   | ${false}  | ${false}
      ${"clean"} | ${true}   | ${true}   | ${false}
      ${"dirty"} | ${false}  | ${false}  | ${false}
      ${"dirty"} | ${false}  | ${true}   | ${false}
      ${"dirty"} | ${true}   | ${false}  | ${false}
      ${"dirty"} | ${true}   | ${true}   | ${true}
      ${"empty"} | ${false}  | ${false}  | ${false}
      ${"empty"} | ${false}  | ${true}   | ${false}
      ${"empty"} | ${true}   | ${false}  | ${false}
      ${"empty"} | ${true}   | ${true}   | ${false}
    `(
      "$state watcher returns dirty:$dirty when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; dirty: boolean }) => {
        const watcher = getWatcher(args);
        const isDirty = watcher.checkDirtyVisible("firstName");
        expect(isDirty).toBe(args.dirty);
      }
    );
  });

  describe("checkDirtyVisible on missing property", () => {
    test.each`
      state      | isEnabled | isVisible | dirty
      ${"clean"} | ${false}  | ${false}  | ${false}
      ${"clean"} | ${false}  | ${true}   | ${false}
      ${"clean"} | ${true}   | ${false}  | ${false}
      ${"clean"} | ${true}   | ${true}   | ${false}
      ${"dirty"} | ${false}  | ${false}  | ${false}
      ${"dirty"} | ${false}  | ${true}   | ${false}
      ${"dirty"} | ${true}   | ${false}  | ${false}
      ${"dirty"} | ${true}   | ${true}   | ${false}
      ${"empty"} | ${false}  | ${false}  | ${false}
      ${"empty"} | ${false}  | ${true}   | ${false}
      ${"empty"} | ${true}   | ${false}  | ${false}
      ${"empty"} | ${true}   | ${true}   | ${false}
    `(
      "$state watcher returns dirty:$dirty when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; dirty: boolean }) => {
        const watcher = getWatcher(args);
        const isDirty = watcher.checkDirtyVisible("unknown" as any);
        expect(isDirty).toBe(args.dirty);
      }
    );
  });

  describe("reset() clears dirty flags", () => {
    const watcher = dirtyWatcher();
    expect(watcher.isDirty).toBeTruthy();

    watcher.reset();
    expect(watcher.isDirty).toBeFalsy();
  });
}
