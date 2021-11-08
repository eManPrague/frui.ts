import { SortingDirection } from "./sortingDirection";
import type { IPagingFilter } from "./types";

export function getSortingDirection(filter: IPagingFilter, columnName: string) {
  const existingIndex = filter.sorting?.findIndex(x => x.column === columnName);

  if (existingIndex === undefined || existingIndex < 0) {
    return undefined;
  }

  return filter.sorting?.[existingIndex].direction;
}

export function setSort(filter: IPagingFilter, columnName: string, direction?: SortingDirection) {
  const existingSort = filter.sorting?.[0];
  const sortDirection =
    direction ??
    (existingSort?.column === columnName && existingSort.direction === SortingDirection.Ascending
      ? SortingDirection.Descending
      : SortingDirection.Ascending);

  if (filter.sorting) {
    filter.sorting[0] = { column: columnName, direction: sortDirection };
    filter.sorting.length = 1;
  } else {
    filter.sorting = [{ column: columnName, direction: sortDirection }];
  }
}

export function addSort(filter: IPagingFilter, columnName: string, direction?: SortingDirection) {
  if (!filter.sorting) {
    filter.sorting = [{ column: columnName, direction: direction ?? SortingDirection.Ascending }];
    return;
  }

  const existingIndex = filter.sorting.findIndex(x => x.column === columnName);
  if (existingIndex === -1) {
    filter.sorting.push({ column: columnName, direction: direction ?? SortingDirection.Ascending });
  } else {
    filter.sorting[existingIndex].direction =
      direction ??
      (filter.sorting[existingIndex].direction === SortingDirection.Ascending
        ? SortingDirection.Descending
        : SortingDirection.Ascending);
  }
}
