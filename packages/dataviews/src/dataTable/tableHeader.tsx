import type { IPagingFilter } from "@frui.ts/data";
import { SortingDirection } from "@frui.ts/data";
import { observer } from "mobx-react-lite";
import React from "react";
import type { ColumnDefinition, PropsWithColumns } from "../dataTypes";

export interface HeaderRowProps<TItem, TContext> extends PropsWithColumns<TItem, TContext> {
  pagingFilter?: IPagingFilter;
  onColumnSort?: (column: ColumnDefinition<TItem, TContext>) => any;

  className?: string;
}

function getSortIndicatorClass(pagingFilter: IPagingFilter, columnName: string | number) {
  if (pagingFilter.sortColumn === columnName) {
    return pagingFilter.sortDirection === SortingDirection.Descending ? "sort-indicator desc" : "sort-indicator asc";
  } else {
    return "sort-indicator";
  }
}

function tableHeader<TItem, TContext>(props: HeaderRowProps<TItem, TContext>) {
  return (
    <tr className={props.className}>
      {props.columns.map((column, i) => {
        const key = column.property ?? i;
        if (column.headerFormatter) {
          return column.headerFormatter({ key, column, context: props.context });
        } else if (props.pagingFilter && column.sortable && column.property) {
          return (
            <th
              key={key}
              className={column.headerClassName ? `sortable ${column.headerClassName}` : "sortable"}
              onClick={() => void props.onColumnSort?.(column)}>
              {column.titleFactory ? column.titleFactory(props.context) : column.title}
              <span className={getSortIndicatorClass(props.pagingFilter, column.property)}></span>
            </th>
          );
        } else {
          return (
            <th key={key} className={column.headerClassName}>
              {column.titleFactory ? column.titleFactory(props.context) : column.title}
            </th>
          );
        }
      })}
    </tr>
  );
}

const TableHeader = observer(tableHeader) as typeof tableHeader;
export default TableHeader;
