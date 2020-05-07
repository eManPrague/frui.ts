import { observer } from "mobx-react-lite";
import * as React from "react";
import { PropsWithColumns } from "../dataTypes";

export interface DataRowProps<TItem, TWrapper extends React.ElementType, TItemCell extends React.ElementType>
  extends PropsWithColumns<TItem> {
  item: TItem;

  wrapperType?: TWrapper;
  wrapperProps?: React.ComponentPropsWithoutRef<TWrapper>;

  itemCellType?: TItemCell;
  itemCellProps?: React.ComponentPropsWithoutRef<TItemCell>;
}

function repeaterRow<TItem, TWrapper extends React.ElementType, TItemCell extends React.ElementType>(
  props: DataRowProps<TItem, TWrapper, TItemCell>
) {
  const Wrapper = props.wrapperType ?? "tr";
  const Item = props.itemCellType ?? "td";

  const { columns, item, itemCellProps } = props;
  return (
    <Wrapper {...props.wrapperProps}>
      {columns.map((column, i) => {
        const key = column.property ?? i;
        const value = column.property ? item[column.property] : undefined;

        if (column.cellFormatter) {
          return column.cellFormatter(value, item, column, key);
        } else {
          return (
            <Item key={key} {...itemCellProps}>
              {column.valueFormatter ? column.valueFormatter(value, item, column) : value}
            </Item>
          );
        }
      })}
    </Wrapper>
  );
}

const RepeaterRow = observer(repeaterRow) as typeof repeaterRow;

export default RepeaterRow;
