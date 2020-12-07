import { observer } from "mobx-react-lite";
import * as React from "react";
import { DataTablePropsBase } from "../dataTypes";
import TableHeader from "./tableHeader";
import TableRow, { TableRowProps } from "./tableRow";

export interface DataTableProps<TItem, TContext>
  extends DataTablePropsBase<TItem, TContext>,
    Pick<TableRowProps<TItem, TContext>, "rowProps"> {
  className?: string;

  headerRowClassName?: string;
}

const defaultProps: Partial<DataTableProps<any, any>> = {
  displayHeader: true,
};

function dataTable<TItem, TContext>(props: DataTableProps<TItem, TContext>) {
  return (
    <table id={props.id} className={props.className}>
      {props.displayHeader && (
        <thead>
          <TableHeader
            columns={props.columns}
            context={props.context}
            pagingFilter={props.pagingFilter}
            onColumnSort={props.onColumnSort}
            className={props.headerRowClassName}
          />
        </thead>
      )}
      <tbody>
        {props.items?.map(item => (
          <TableRow
            key={String(item[props.itemKey])}
            item={item}
            columns={props.columns}
            context={props.context}
            rowProps={props.rowProps}
          />
        ))}
      </tbody>
    </table>
  );
}

dataTable.defaultProps = defaultProps;
const DataTable = observer(dataTable) as typeof dataTable;
export default DataTable;
