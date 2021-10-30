import type { IPagingFilter } from "./types";
import { SortingDirection } from "./sortingDirection";

export function applySort(filter: IPagingFilter, columnName: string) {
  if (filter.sortColumn === columnName) {
    filter.sortDirection =
      filter.sortDirection === SortingDirection.Ascending ? SortingDirection.Descending : SortingDirection.Ascending;
  } else {
    filter.sortColumn = columnName;
    filter.sortDirection = SortingDirection.Ascending;
  }
}
