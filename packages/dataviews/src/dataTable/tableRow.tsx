import { observer } from "mobx-react-lite";
import * as React from "react";
import { PropsWithColumns } from "../dataTypes";

export interface DataRowProps<TItem, TContext> extends PropsWithColumns<TItem, TContext> {
  item: TItem;

  className?: string;
  cellClassName?: string;
}

function tableRow<TItem, TContext>({ item, columns, context, className, cellClassName }: DataRowProps<TItem, TContext>) {
  return (
    <tr className={className}>
      {columns.map((column, i) => {
        const key = column.property ?? i;
        const value = column.property ? item[column.property] : undefined;

        if (column.cellFormatter) {
          return column.cellFormatter({ key, value, item, column, context });
        } else {
          return (
            <td key={key} className={cellClassName} style={column.cellStyle}>
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
