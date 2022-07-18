import { observer } from "mobx-react-lite";
import React from "react";
import type { PropsWithColumns, ResponsiveColumnDefinition } from "../dataTypes";

export interface DataListRowProps<TItem, TContext> extends PropsWithColumns<TItem, TContext> {
  item: TItem;
  columns: ResponsiveColumnDefinition<TItem, TContext>[];
}

interface HeaderProps<TItem, TContext> {
  column: ResponsiveColumnDefinition<TItem, TContext>;
  context: TContext;
}

function Header<TItem, TContext>({ column, context }: HeaderProps<TItem, TContext>) {
  if (column.headerFormatter) {
    return <>{column.headerFormatter({ key: "list-header", column, context })}</>;
  } else {
    return (
      <th scope="row" className={column.headerClassName}>
        {column.responsiveTitleFactory?.(context) ?? column.responsiveTitle ?? column.titleFactory?.(context) ?? column.title}
      </th>
    );
  }
}

function DataListRowImpl<TItem, TContext>({ item, columns, context }: DataListRowProps<TItem, TContext>) {
  return (
    <tbody>
      {columns
        .filter(x => x.responsiveVisible !== false)
        .map((column, i) => {
          const key = column.property ?? i;
          const value = column.property ? (item[column.property] as unknown as string) : undefined;
          const hasHeader = column.responsiveTitle !== false;

          return (
            <tr key={key}>
              {hasHeader && <Header column={column} context={context} />}
              <td colSpan={hasHeader ? 1 : 2}>
                {column.cellFormatter
                  ? column.cellFormatter({ key, value, item, column, context })
                  : column.valueFormatter
                  ? column.valueFormatter({ value, item, column, context })
                  : value}
              </td>
            </tr>
          );
        })}
    </tbody>
  );
}

const DataListRow = observer(DataListRowImpl) as typeof DataListRowImpl;

export default DataListRow;
