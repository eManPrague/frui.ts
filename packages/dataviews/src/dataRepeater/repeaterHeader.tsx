import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { ColumnDefinition, PropsWithColumns } from "../dataTypes";

export interface HeaderRowProps<TItem, TContext, TWrapper extends React.ElementType, TItemCell extends React.ElementType>
  extends PropsWithColumns<TItem, TContext> {
  pagingFilter?: IPagingFilter;
  onColumnSort?: (column: ColumnDefinition<TItem, TContext>) => any;

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

function repeaterHeader<TItem, TContext, TWrapper extends React.ElementType, TItemCell extends React.ElementType>(
  props: HeaderRowProps<TItem, TContext, TWrapper, TItemCell>
) {
  const Wrapper = props.wrapperType ?? "tr";
  const Item = props.itemCellType ?? "th";
  const { context } = props;

  return (
    <Wrapper {...props.wrapperProps}>
      {props.columns.map((column, i) => {
        const key = column.property ?? i;

        if (column.headerFormatter) {
          return column.headerFormatter({ key, column, context });
        } else if (props.pagingFilter && column.sortable && column.property) {
          return (
            <Item
              key={key}
              className="sortable"
              onClick={() => props.onColumnSort?.(column)}
              {...props.itemCellProps}
              style={column.headerStyle}>
              {column.titleFactory ? column.titleFactory(context) : column.title}
              <span className={getSortIndicatorClass(props.pagingFilter, column.property)}></span>
            </Item>
          );
        } else {
          return (
            <Item key={key} {...props.itemCellProps} style={column.headerStyle}>
              {column.titleFactory ? column.titleFactory(context) : column.title}
            </Item>
          );
        }
      })}
    </Wrapper>
  );
}

const RepeaterHeader = observer(repeaterHeader) as typeof repeaterHeader;

export default RepeaterHeader;
