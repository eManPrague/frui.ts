import { observer } from "mobx-react-lite";
import React from "react";
import type { PropsWithColumns } from "../dataTypes";

export interface DataRowProps<TItem, TContext, TWrapper extends React.ElementType, TItemCell extends React.ElementType>
  extends PropsWithColumns<TItem, TContext> {
  item: TItem;

  wrapperType?: TWrapper;
  wrapperProps?: React.ComponentPropsWithoutRef<TWrapper>;

  itemCellType?: TItemCell;
  itemCellProps?: React.ComponentPropsWithoutRef<TItemCell>;
}

function repeaterRow<TItem, TContext, TWrapper extends React.ElementType, TItemCell extends React.ElementType>(
  props: DataRowProps<TItem, TContext, TWrapper, TItemCell>
) {
  const Wrapper = props.wrapperType ?? "tr";
  const Item = props.itemCellType ?? "td";
  const { context } = props;

  const { columns, item, itemCellProps } = props;
  return (
    <Wrapper {...props.wrapperProps}>
      {columns.map((column, i) => {
        const key = column.property ?? i;
        const value = column.property ? item[column.property] : undefined;

        if (column.cellFormatter) {
          return column.cellFormatter({ key, value, item, column, context });
        } else {
          return (
            <Item
              key={key}
              className={column.cellClassName}
              {...itemCellProps}
              {...column.cellProps?.({ value, item, column, context })}>
              {column.valueFormatter ? column.valueFormatter({ value, item, column, context }) : value}
            </Item>
          );
        }
      })}
    </Wrapper>
  );
}

const RepeaterRow = observer(repeaterRow) as typeof repeaterRow;

export default RepeaterRow;
