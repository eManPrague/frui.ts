import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { ColumnDefinition, PropsWithColumns } from "../dataTypes";

export interface HeaderRowProps<TItem, TContext> extends PropsWithColumns<TItem, TContext> {
  pagingFilter?: IPagingFilter;
  onColumnSort?: (column: ColumnDefinition<TItem, TContext>) => any;

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

function tableHeader<TItem, TContext>(props: HeaderRowProps<TItem, TContext>) {
  return (
    <tr className={props.className}>
      {props.columns.map((column, i) => {
        const key = column.property ?? i;
        if (column.headerFormatter) {
          return column.headerFormatter({ key, column, context: props.context });
        } else if (props.pagingFilter && column.sortable && column.property) {
          return (
            <th key={key} className="sortable" style={column.headerStyle} onClick={() => props.onColumnSort?.(column)}>
              {column.title}
              <span className={getSortIndicatorClass(props.pagingFilter, column.property)}></span>
            </th>
          );
        } else {
          return (
            <th key={key} className={props.cellClassName} style={column.headerStyle}>
              {column.title}
            </th>
          );
        }
      })}
    </tr>
  );
}

const TableHeader = observer(tableHeader) as typeof tableHeader;
export default TableHeader;
