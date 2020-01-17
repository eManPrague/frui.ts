import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { observer } from "mobx-react-lite";
import * as React from "react";

type onSortChangedHandler = (key: string, direction?: SortingDirection) => void;

export interface ISortingHeaderProps {
  column: string;
  filter?: IPagingFilter;
  onSortChanged?: onSortChangedHandler;
  children?: React.ReactNode;
}

const SortingHeader: React.FunctionComponent<ISortingHeaderProps> = observer(({ column, filter, onSortChanged, children }) => {
  const clickHandler = () => {
    if (filter) {
      if (filter.sortColumn === column) {
        filter.sortDirection = filter.sortDirection === SortingDirection.Ascending ? SortingDirection.Descending : SortingDirection.Ascending;
      }
      else {
        filter.sortColumn = column;
        filter.sortDirection = SortingDirection.Ascending;
      }
    }

    if (onSortChanged) {
      onSortChanged(column, filter && filter.sortDirection); // TODO send sorting direction even if filter is not present
    }
  };

  return <th onClick={clickHandler}>{children} {filter && getSortIndicator(filter.sortColumn, filter.sortDirection, column)}</th>;
});
export default SortingHeader;

function getSortIndicator(currentColumn: string | undefined, currentDirection: SortingDirection | undefined, column: string) {
  if (column !== currentColumn) {
    return null;
  }

  return currentDirection === SortingDirection.Descending ? "🔽" : "🔼";
}
