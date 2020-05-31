import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { ColumnDefinition, PropsWithColumns } from "../dataTypes";

export interface HeaderRowProps<TItem> extends PropsWithColumns<TItem> {
  pagingFilter?: IPagingFilter;
  onColumnSort?: (column: ColumnDefinition<TItem>) => any;

  className?: string;
  cellClassName?: string;
}

function getSortIndicatorClass(pagingFilter: IPagingFilter, columnName: string | number) {
  if (pagingFilter.sortColumn === columnName) {
    return pagingFilter.sortDirection === SortingDirection.Descending ? "sort-indicator desc" : "sort-indicator asc";
  } else {
    return "sort-indicator";
  }
}

function tableHeader<TItem>(props: HeaderRowProps<TItem>) {
  return (
    <tr className={props.className}>
      {props.columns.map((col, i) => {
        const key = col.property ?? i;
        if (col.headerFormatter) {
          return col.headerFormatter(col, key);
        } else if (props.pagingFilter && col.sortable && col.property) {
          return (
            <th key={key} className="sortable" style={col.headerStyle} onClick={() => props.onColumnSort?.(col)}>
              {col.title}
              <span className={getSortIndicatorClass(props.pagingFilter, col.property)}></span>
            </th>
          );
        } else {
          return (
            <th key={key} className={props.cellClassName} style={col.headerStyle}>
              {col.title}
            </th>
          );
        }
      })}
    </tr>
  );
}

const TableHeader = observer(tableHeader) as typeof tableHeader;
export default TableHeader;
