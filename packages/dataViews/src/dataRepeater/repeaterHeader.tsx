import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { ColumnDefinition, PropsWithColumns } from "../dataTypes";

export interface HeaderRowProps<TItem, TWrapper extends React.ElementType, TItemCell extends React.ElementType>
  extends PropsWithColumns<TItem> {
  pagingFilter?: IPagingFilter;
  onColumnSort?: (column: ColumnDefinition<TItem>) => any;

  wrapperType?: TWrapper;
  wrapperProps?: React.ComponentPropsWithoutRef<TWrapper>;

  itemCellType?: TItemCell;
  itemCellProps?: React.ComponentPropsWithoutRef<TItemCell>;
}

function getSortIndicatorClass(pagingFilter: IPagingFilter, columnName: string | number) {
  if (pagingFilter.sortColumn === columnName) {
    return pagingFilter.sortDirection === SortingDirection.Descending ? "sort-indicator desc" : "sort-indicator asc";
  } else {
    return "sort-indicator";
  }
}

function repeaterHeader<TItem, TWrapper extends React.ElementType, TItemCell extends React.ElementType>(
  props: HeaderRowProps<TItem, TWrapper, TItemCell>
) {
  const Wrapper = props.wrapperType ?? "tr";
  const Item = props.itemCellType ?? "th";

  return (
    <Wrapper {...props.wrapperProps}>
      {props.columns.map((col, i) => {
        const key = col.property ?? i;

        if (col.headerFormatter) {
          return col.headerFormatter(col, key);
        } else if (props.pagingFilter && col.sortable && col.property) {
          return (
            <Item
              key={key}
              className="sortable"
              onClick={() => props.onColumnSort?.(col)}
              {...props.itemCellProps}
              style={col.headerStyle}>
              {col.title}
              <span className={getSortIndicatorClass(props.pagingFilter, col.property)}></span>
            </Item>
          );
        } else {
          return (
            <Item key={key} {...props.itemCellProps} style={col.headerStyle}>
              {col.title}
            </Item>
          );
        }
      })}
    </Wrapper>
  );
}

const RepeaterHeader = observer(repeaterHeader) as typeof repeaterHeader;

export default RepeaterHeader;
