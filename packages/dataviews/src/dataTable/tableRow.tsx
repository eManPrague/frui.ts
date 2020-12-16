import { observer } from "mobx-react-lite";
import React from "react";
import { PropsWithColumns } from "../dataTypes";

export interface TableRowProps<TItem, TContext> extends PropsWithColumns<TItem, TContext> {
  item: TItem;

  rowProps?: (item: TItem, context: TContext) => React.ComponentPropsWithoutRef<"tr">;
}

function tableRow<TItem, TContext>({ item, columns, context, rowProps }: TableRowProps<TItem, TContext>) {
  return (
    <tr {...rowProps?.(item, context)}>
      {columns.map((column, i) => {
        const key = column.property ?? i;
        const value = column.property ? item[column.property] : undefined;

        if (column.cellFormatter) {
          return column.cellFormatter({ key, value, item, column, context });
        } else {
          return (
            <td key={key} className={column.cellClassName} {...column.cellProps?.({ value, item, column, context })}>
              {column.valueFormatter ? column.valueFormatter({ value, item, column, context }) : value}
            </td>
          );
        }
      })}
    </tr>
  );
}

const TableRow = observer(tableRow) as typeof tableRow;
export default TableRow;
