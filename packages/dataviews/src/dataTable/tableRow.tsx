import { observer } from "mobx-react-lite";
import * as React from "react";
import { PropsWithColumns } from "../dataTypes";

export interface DataRowProps<TItem> extends PropsWithColumns<TItem> {
  item: TItem;

  className?: string;
  cellClassName?: string;
}

function tableRow<TItem>({ item, columns, className, cellClassName }: DataRowProps<TItem>) {
  return (
    <tr className={className}>
      {columns.map((column, i) => {
        const key = column.property ?? i;
        const value = column.property ? item[column.property] : undefined;

        if (column.cellFormatter) {
          return column.cellFormatter(value, item, column, key);
        } else {
          return (
            <td key={key} className={cellClassName} style={column.cellStyle}>
              {column.valueFormatter ? column.valueFormatter(value, item, column) : value}
            </td>
          );
        }
      })}
    </tr>
  );
}

const TableRow = observer(tableRow) as typeof tableRow;
export default TableRow;
