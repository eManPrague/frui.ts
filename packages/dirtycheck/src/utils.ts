import type { EntityDirtyWatcher } from "./types";
import Configuration from "./configuration";

export function attachDirtyWatcher<TEntity>(target: TEntity, dirtyWatcher: EntityDirtyWatcher<TEntity>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (target as any)[Configuration.dirtyWatcherAttachedProperty] = dirtyWatcher;
}

export function getDirtyWatcher<TEntity>(target: TEntity) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (target as any)[Configuration.dirtyWatcherAttachedProperty] as EntityDirtyWatcher<TEntity> | undefined;
}
